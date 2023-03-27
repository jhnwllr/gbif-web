import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import equal from 'fast-deep-equal/react';
import startCase from 'lodash/startCase';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink, HyperText, Switch } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
// import { AgentSummary } from './AgentSummary'
import * as styles from "../styles";
import { Group } from './Groups';
import get from 'lodash/get';
import { Card, CardHeader2 } from '../../shared';
import { prettifyString } from '../../../utils/labelMaker/config2labels';
import _ from 'lodash';
import useRelatedData from '../useRelatedData';
import { AssertionTable } from '../Assertions';
import { GeneralInfo } from './GeneralInfo';

const { Term: T, Value: V } = Properties;

export function Location({ event, setActiveImage, ...props }) {
  const [displayVerbatim, setDisplayVerbatim] = useState(false);
  if (!event) return null;
  const collectionEvent = event;
  const location = _.omitBy(get(event, 'location'), _.isNil);
  const occurrence = _.omitBy(get(event, 'occurrence'), _.isNil);
  const georeference = _.omitBy(get(event, 'location.georeference', {}), _.isNil);
  if (_.isEmpty(collectionEvent) && _.isEmpty(location) && _.isEmpty(georeference)) return null;

  const { decimalLongitude, decimalLatitude } = georeference;

  const eventFields = [
    'eventName',
    'fieldNumber',
    'eventDate',
    'habitat',
    'protocolDescription',
    'sampleSizeUnit',
    'sampleSizeValue',
    'eventEffort',
    'fieldNotes',
    'eventRemarks',
    //'locationId'
  ];
  const occurrenceFields = [
    'organismQuantity',
    'organismQuantityType',
    'sex',
    'lifeStage',
    'reproductiveCondition',
    'behavior',
    'establishmentMeans',
    'occurrenceStatus',
    'pathway',
    'degreeOfEstablishment',
    'georeferenceVerificationStatus',
    'occurrenceRemarks',
    'informationWithheld',
    'dataGeneralizations',
    'recordedBy',
    // 'recordedById',
    'associatedMedia',
    'associatedOccurrences',
    'associatedTaxa',
    // 'occurrenceId'
  ];

  const verbatimFieldsNames = ['verbatimEventDate',
    'verbatimLocality',
    'verbatimElevation',
    'verbatimDepth',
    'verbatimCoordinates',
    'verbatimLatitude',
    'verbatimLongitude',
    'verbatimCoordinateSystem',
    'verbatimSrs',
  ];
  const verbatimFields = verbatimFieldsNames.filter(x => !!collectionEvent[x]);

  const locationFields = [
    'higherGeography',
    'continent',
    'waterBody',
    'islandGroup',
    'island',
    'countryCode',
    'stateProvince',
    'county',
    'municipality',
    'locality',
    'minimumElevationInMeters',
    'maximumElevationInMeters',
    'minimumDistanceAboveSurfaceInMeters',
    'maximumDistanceAboveSurfaceInMeters',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    'verticalDatum',
    'locationAccordingTo',
    'locationRemarks',
    //'locationId'
  ];
  const hasLocation = locationFields.some(x => !!location[x]);

  const georeferenceFields = [
    //'georeferenceId',
    'decimalLatitude',
    'decimalLongitude',
    'geodeticDatum',
    'coordinateUncertaintyInMeters',
    'coordinatePrecision',
    'pointRadiusSpatialFit',
    'footprintWkt',
    'footprintSrs',
    'footprintSpatialFit',
    'georeferencedBy',
    'georeferencedDate',
    'georeferenceProtocol',
    'georeferenceSources',
    'georeferenceRemarks',
    'preferredSpatialRepresentation'
  ];
  const hasGeoreference = georeferenceFields.some(x => !!georeference[x]);

  const zoomInLevel = georeference.coordinateUncertaintyInMeters > 2000 ? 12 : 15;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>{prettifyString(event.eventType)}</CardHeader2>
    </div>
    {collectionEvent.isFirstLocation && decimalLongitude && <div>
      <div css={mapThumb}>
        {georeference.coordinateUncertaintyInMeters > 500 && <div className="gb-location-comment">
          Uncertainty: {georeference.coordinateUncertaintyInMeters}m
        </div>}
        <img src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/static/pin-s-circle+ef6a0a(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},6,0/800x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
        <img className="gb-on-hover"
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+ef6a0a(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},${zoomInLevel},0/800x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        {/* <div className="gb-capped"></div>
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},15,0/800x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        /> */}
      </div>
    </div>}

    {/* {decimalLongitude && <img css={css`
        width: calc(100% - 24px);
        border-radius: 12px;
        border: 1px solid #eee;
        margin-left: 12px;
      `} src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},5,0/800x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />} */}
    <div css={css`padding: 12px 24px;`}>
      <Properties dense css={styles.properties} breakpoint={800}>
        {eventFields
          .filter(x => !!collectionEvent[x]).map(x => <React.Fragment key={x}>
            <T>
              {prettifyString(x)}
            </T>
            <V>
              <HyperText text={collectionEvent[x]} inline />
            </V>
          </React.Fragment>)}
        {occurrenceFields
          .filter(x => !!occurrence[x]).map(x => <React.Fragment key={x}>
            <T>
              {prettifyString(x)}
            </T>
            <V>
              <HyperText text={occurrence[x]} inline />
            </V>
          </React.Fragment>)}

        {displayVerbatim && verbatimFields
          .filter(x => !!collectionEvent[x]).map(x => <React.Fragment key={x}>
            <T>
              {prettifyString(x)}
            </T>
            <V>
              <HyperText text={collectionEvent[x]} inline />
            </V>
          </React.Fragment>)}
      </Properties>
      {hasLocation && collectionEvent.isFirstLocation && <div css={dataSection}>
        <h3 css={sectionHeader}>Location</h3>
        <Properties dense css={styles.properties} breakpoint={800}>
          {locationFields
            .filter(x => !!location[x]).map(x => <React.Fragment key={x}>
              <T>
                {prettifyString(x)}
              </T>
              <V>
                <HyperText text={location[x]} inline />
              </V>
            </React.Fragment>)}
        </Properties>
      </div>}
      {collectionEvent.isFirstLocation && hasGeoreference && <div css={dataSection}>
        <h3 css={sectionHeader}>Georeference</h3>
        <Properties dense css={styles.properties} breakpoint={800}>
          {georeferenceFields
            .filter(x => !!georeference[x]).map(x => <React.Fragment key={x}>
              <T>
                {prettifyString(x)}
              </T>
              <V>
                <HyperText text={georeference[x]} inline lineClamp={5} />
              </V>
            </React.Fragment>)}
        </Properties>
      </div>}
    </div>
    <GeneralInfo id={collectionEvent.eventId} type="OCCURRENCE" />
    {verbatimFields.length > 0 && <div css={styles.cardFooter}>
      <label>
        <Switch checked={displayVerbatim} onChange={() => setDisplayVerbatim(!displayVerbatim)} style={{ marginInlineEnd: 8 }} /> Display verbatim values
      </label>
    </div>}
  </Card>
}

function GeologicalContext({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'geologicalContextID',
    'earliestEonOrLowestEonothem',
    'latestEonOrHighestEonothem',
    'earliestEraOrLowestErathem',
    'latestEraOrHighestErathem',
    'earliestPeriodOrLowestSystem',
    'latestPeriodOrHighestSystem',
    'earliestEpochOrLowestSeries',
    'latestEpochOrHighestSeries',
    'earliestAgeOrLowestStage',
    'latestAgeOrHighestStage',
    'lowestBiostratigraphicZone',
    'highestBiostratigraphicZone',
    'lithostratigraphicTerms',
    'group',
    'formation',
    'member',
    'bed'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.geologicalContext" id="geological-context">
    <Properties css={styles.properties} breakpoint={800}>
      <PlainTextField term={termMap.geologicalContextID} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEonOrLowestEonothem} showDetails={showAll} />
      <PlainTextField term={termMap.latestEonOrHighestEonothem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEraOrLowestErathem} showDetails={showAll} />
      <PlainTextField term={termMap.latestEraOrHighestErathem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestPeriodOrLowestSystem} showDetails={showAll} />
      <PlainTextField term={termMap.latestPeriodOrHighestSystem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEpochOrLowestSeries} showDetails={showAll} />
      <PlainTextField term={termMap.latestEpochOrHighestSeries} showDetails={showAll} />
      <PlainTextField term={termMap.earliestAgeOrLowestStage} showDetails={showAll} />
      <PlainTextField term={termMap.latestAgeOrHighestStage} showDetails={showAll} />
      <PlainTextField term={termMap.lowestBiostratigraphicZone} showDetails={showAll} />
      <PlainTextField term={termMap.highestBiostratigraphicZone} showDetails={showAll} />
      <PlainTextField term={termMap.lithostratigraphicTerms} showDetails={showAll} />
      <PlainTextField term={termMap.group} showDetails={showAll} />
      <PlainTextField term={termMap.formation} showDetails={showAll} />
      <PlainTextField term={termMap.member} showDetails={showAll} />
      <PlainTextField term={termMap.bed} showDetails={showAll} />
    </Properties>
  </Group>
}


const dataSection = css`
  border-top: 1px solid var(--paperBorderColor);
  margin-top: 8px;
`;

const sectionHeader = css`
  color: var(--color400);
  font-weight: normal;
  font-size: 14px;
  margin: 4px 0 0px 0;
  text-align: end;
`;

const mapThumb = css`
  position: relative;
  .gb-on-hover {
    position: absolute;
    opacity: .001;
    transition: opacity 300ms ease;
  }
  &:hover {
    .gb-on-hover {
      opacity: 1;
    }
  }

  .gb-location-comment {
    position: absolute;
    z-index: 100;
    background: #444;
    color: white;
    font-size: 12px;
    padding: 5px; 
    display: inline-block;
    margin: 6px;
    width: auto;
    border-radius: 4px;
    border: 1px solid #aaa;
  }
  .gb-capped {
    width: 20%;
    height: 26%;
    top: 30%;
    left: 40%;
    position: absolute;
    opacity: .001;
    transition: opacity 300ms ease;
    background: tomato;
    z-index: 100;
    &:hover {
      + img {
        opacity: 1;
      }
    }
     + img {
      position: absolute;
      opacity: 0;
      transition: opacity 300ms ease;
    }
  }
  
  div, img, a {
    top: 0;
    width: 100%;
    margin-bottom: 12px;
    display: block;
  }
  a {
    position: absolute;
    height: 100%;
  }
`;