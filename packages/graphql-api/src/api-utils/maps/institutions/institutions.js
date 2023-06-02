// using axios page through all institutions from the gbif API, given a filter
// and concatenate the results into a single array
import axios from 'axios';
import config from '../../../config';
import cachedInstitutionResponse from './cachedInstitutionResponse.json';
let allInstitutions = cachedInstitutionResponse;

export const getInstitutions = async ({limit: size, offset: from, ...filter} = {}, req) => {
  const limit = Number.parseInt(size) || 300;
  let offset = Number.parseInt(from) || 0;
  let institutions = [];
  let total = 0;

  do {
    const response = await axios.get(`${config.apiv1}/grscicoll/institution`, {
      params: {
        limit,
        offset,
        hasCoordinate: true, // this filter doesn't exist in the API, but it should for this to work well
        ...filter
      }
    });

    // prune response to only include a subset of the fields, to reduce the size of the response
    // the fields are latitude, longitude, code, name, key, active, numberSpecimens
    response.data.results = response.data.results.map((institution) => {
      return {
        latitude: institution.latitude,
        longitude: institution.longitude,
        name: institution.name,
        key: institution.key,
        numberSpecimens: institution.numberSpecimens
      }
    });

    institutions = institutions.concat(response.data.results);
    total = response.data.count;
    offset += limit;

    // cancel loop if request is closed
    if (req && req.aborted) {
      return null;
    }
  } while (offset < total && !size);

  return institutions;
}

// get institutions as geojson
export const getInstitutionsGeojson = async (filter, req, refreshCache) => {
  // if refreshCache, then return cached results, but trigger a new request in the background and update the cached resonse to next request
  if (refreshCache) {
    getInstitutions(filter, req).then((institutions) => {
      allInstitutions = institutions;
    });
  }

  let institutions = allInstitutions;
  if (filter && Object.keys(filter).length > 0) {
    institutions = await getInstitutions(filter, req) || [];
  }
  
  // remove institutiuons without coordinates
  institutions = institutions.filter((institution) => {
    return institution.latitude && institution.longitude;
  });

  const geojson = {
    type: 'FeatureCollection',
    features: institutions.map((institution) => {
      const {latitude, longitude, ...properties} = institution;
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        properties: {
          ...properties
        }
      }
    })
  }

  return geojson;
}

// trigger at sartup to update the cached institutions
getInstitutionsGeojson({}, null, true);
// update the cahced institutions every 30 minutes
setInterval(() => {
  getInstitutionsGeojson({}, null, true);
}, 1000 * 60 * 30);