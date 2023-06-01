import _ from 'lodash';
import { getExcerpt } from '#/helpers/utils';

async function getCountryDetails(countryCodes, dataSources) {
  const results = await Promise.all(countryCodes.map((countryCode) => getCountryDetail(countryCode, dataSources)));
  return results;
}

async function getCountryDetail(countryCode, dataSources) {
  const publisherCount = await dataSources.organizationAPI.searchOrganizations({ query: { country: countryCode, limit: 0 } }).then((response) => response.count);
  const datasetCount = await dataSources.datasetAPI.searchDatasets({ query: { country: countryCode, limit: 0 } }).then((response) => response.count);
  const institutionCount = await dataSources.institutionAPI.searchInstitutions({ query: { country: countryCode, limit: 0 } }).then((response) => response.count);
  const collectionCount = await dataSources.collectionAPI.searchCollections({ query: { country: countryCode, limit: 0 } }).then((response) => response.count);
  const participants = await dataSources.participantAPI.searchParticipants({ query: { country: countryCode, limit: 100 } }).then((response) => response.results);
  return {
    key: countryCode,
    publisherCount,
    datasetCount,
    institutionCount,
    collectionCount,
    participants: participants,
    isVotingParticipant: _.some(participants, { participationStatus: 'VOTING' }),
  };
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    countries: (parent, args, { dataSources }) =>
      dataSources.countryAPI.getCountryCodes()
        .then((response) => getCountryDetails(response, dataSources)),
    country: (parent, { key }, { dataSources }) =>
      dataSources.collectionAPI.getCountryByKey({ key }),
  },
  CountryDetail: {
    // institution: ({ institutionKey: key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   return dataSources.institutionAPI.getInstitutionByKey({ key });
    // },
    // occurrenceCount: ({ key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   return dataSources.occurrenceAPI
    //     .searchOccurrenceDocuments({
    //       query: {
    //         predicate: { type: 'equals', key: 'collectionKey', value: key },
    //       },
    //     })
    //     .then((response) => response.total);
    // },
    // replacedByCollection: ({ replacedBy }, args, { dataSources }) => {
    //   if (!replacedBy) return null;
    //   return dataSources.collectionAPI.getCollectionByKey({ key: replacedBy });
    // },
    // excerpt: ({ description, taxonomicCoverage, geography }) => {
    //   if (typeof description === 'undefined') return null;
    //   return getExcerpt({
    //     strings: [description, taxonomicCoverage, geography],
    //     length: 300,
    //   }).plainText;
    // },
    // richness: (collection) => {
    //   let completeness = 0;
    //   let totalAvailable = 0;
    //   const fields = [
    //     'taxonomicCoverage',
    //     'geography',
    //     'address.country',
    //     'address.address',
    //     'code',
    //     'email',
    //     'homepage',
    //     { field: 'numberSpecimens', counts: 2 },
    //   ];
    //   // each field gives you point per default. But con be configured to be more than 1 for a field
    //   fields.forEach((x) => {
    //     let conf = {
    //       field: x,
    //       counts: 1,
    //     };
    //     if (typeof x !== 'string') {
    //       conf = x;
    //     }
    //     totalAvailable += conf.counts;
    //     if (_.get(collection, conf.field)) completeness += conf.counts;
    //   });

    //   // descriptions can give up to x points depending on length
    //   const maxDescPoint = 2;
    //   const description = collection.description || '';
    //   const descPoints = between(
    //     Math.ceil(description.length / 200),
    //     0,
    //     maxDescPoint,
    //   );
    //   completeness += descPoints;
    //   totalAvailable += maxDescPoint;

    //   // returns as a percentage rounded up
    //   return Math.ceil((100 * completeness) / totalAvailable);
    // },
  },
};
