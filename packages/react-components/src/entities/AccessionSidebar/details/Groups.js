import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Properties } from '../../../components';
import {
  PlainTextField,
  EnumField,
  HtmlField,
} from '../../EventSidebar/details/properties';
import * as css from '../../EventSidebar/styles';
import { Trial } from './Trial';
import Map from '../../SiteSidebar/details/Map/Map';
import ThemeContext from '../../../style/themes/ThemeContext';
import { Measurements } from './Measurements';

const { Term: T, Value: V } = Properties;

export function Groups({ trials, event, showAll }) {
  if (!event) return null;

  let termMap = {};
  Object.entries(event).forEach((item) => {
    termMap[item[0]] = { simpleName: item[0], value: item[1] };
  });

  return (
    <>
      <Accession {...{ showAll, termMap, event }} />
      <Measurements {...{ showAll, termMap, event }} />
      {/* <Trials {...{ showAll, termMap, trials }} /> */}
      <Location {...{ showAll, termMap, event }} />
      <MapAccordion {...{ showAll, termMap, event }} />
    </>
  );
}

export function Group({ label, ...props }) {
  return (
    <Accordion
      summary={<FormattedMessage id={label} />}
      defaultOpen={true}
      css={css.group()}
      {...props}
    />
  );
}

function Accession({ event }) {
  const collectionFields = [
    'collectionFillRate',
    'purityDebrisPercentage',
    'purityPercentage',
    'sampleWeightInGrams',
    'sampleSize',
    'seedPerGram',
    'dateCollected',
    'thousandSeedWeight',
    'degreeOfEstablishment',
    'primaryCollector',
    'plantForm',
    'collectionPermitNumber',
    'numberPlantsSampled',
    'embryoType',
    'publicationDOI',
  ];

  const storageFields = [
    'formInStorage',
    'dateInStorage',
    'storageTemperatureInCelsius',
    'relativeHumidityPercentage',
    'preStorageTreatmentNotesHistory',
    'primaryStorageSeedBank',
    'duplicatesReplicates',
    'storageBehaviour',
    'dormancyClass',
  ];

  return (
    <>
      <AccessionFields
        event={event}
        fields={collectionFields}
        groupLabel='extensions.seedbank.groups.collection'
      />
      <AccessionFields
        event={event}
        fields={storageFields}
        groupLabel='extensions.seedbank.groups.storage'
      />
    </>
  );
}

function AccessionFields({ event, fields, groupLabel }) {
  const accession = event.extensions?.seedbank;
  const theme = useContext(ThemeContext);
  return (
    <Group label={groupLabel}>
      <Properties style={{ fontSize: 12 }} horizontal dense>
        {fields.map((field) => (
          <React.Fragment key={field}>
            <T>
              <FormattedMessage
                id={`extensions.seedbank.fields.${field}.name`}
                defaultMessage={field}
              />
            </T>
            <V style={{ color: accession[field] ? theme.color : '#aaa' }}>
              {accession[field] || 'Not Supplied'}
              {accession[field] && (
                <FormattedMessage
                  id={`extensions.seedbank.fields.${field}.unit`}
                  defaultMessage=' '
                />
              )}
            </V>
          </React.Fragment>
        ))}
      </Properties>
    </Group>
  );
}

function Trials({ trials }) {
  return (
    <Group label='extensions.seedbank.groups.trials'>
      {trials?.length > 0 ? (
        trials.map((trial) => <Trial key={trial.eventID} trial={trial} />)
      ) : (
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 24,
          }}
        >
          <span style={{ color: '#aaa', fontSize: 14 }}>
            No trial data found
          </span>
        </div>
      )}
    </Group>
  );
}

function MapAccordion({ event }) {
  const hasCoordinates =
    (event?.decimalLatitude != null && event?.decimalLongitude !== null) ||
    event?.wktConvexHull !== null;

  return hasCoordinates ? (
    <Group label='extensions.seedbank.groups.map'>
      <Map
        latitude={event.decimalLatitude}
        longitude={event.decimalLongitude}
        wkt={event.wktConvexHull}
      />
    </Group>
  ) : null;
}

function Location({ showAll, termMap }) {
  const hasContent = [
    'locationID',
    'higherGeographyID',
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
    'verbatimLocality',
    'verbatimElevation',
    'verbatimDepth',
    'minimumDistanceAboveSurfaceInMeters',
    'maximumDistanceAboveSurfaceInMeters',
    'locationAccordingTo',
    'locationRemarks',
    'decimalLatitude',
    'decimalLongitude',
    'coordinateUncertaintyInMeters',
    'coordinatePrecision',
    'pointRadiusSpatialFit',
    'verbatimCoordinateSystem',
    'verbatimSRS',
    'verticalDatum',
    'footprintWKT',
    'footprintSRS',
    'footprintSpatialFit',
    'georeferencedBy',
    'georeferencedDate',
    'georeferenceProtocol',
    'georeferenceSources',
    'georeferenceVerificationStatus',
    'georeferenceRemarks',
    'country',
    'minimumElevationInMeters',
    'maximumElevationInMeters',
    'elevation',
    'elevationAccuracy',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    'depth',
    'depthAccuracy',
    'geodeticDatum',
    'verbatimCoordinates',
    'verbatimLatitude',
    'verbatimLongitude',
  ].find((x) => termMap[x]);
  if (!hasContent) return null;

  return (
    <Group label='extensions.seedbank.groups.location'>
      <Properties css={css.properties} breakpoint={800}>
        <PlainTextField term={termMap.locationID} showDetails={showAll} />
        <PlainTextField
          term={termMap.higherGeographyID}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.higherGeography} showDetails={showAll} />

        <EnumField
          term={termMap.continent}
          showDetails={showAll}
          getEnum={(value) => `enums.continent.${value}`}
        />
        <EnumField
          term={termMap.countryCode}
          label='occurrenceFieldNames.country'
          showDetails={showAll}
          getEnum={(value) => `enums.countryCode.${value}`}
        />

        <PlainTextField term={termMap.waterBody} showDetails={showAll} />
        <PlainTextField term={termMap.islandGroup} showDetails={showAll} />
        <PlainTextField term={termMap.island} showDetails={showAll} />
        <PlainTextField term={termMap.stateProvince} showDetails={showAll} />
        <PlainTextField term={termMap.county} showDetails={showAll} />
        <PlainTextField term={termMap.municipality} showDetails={showAll} />

        <PlainTextField term={termMap.locality} showDetails={showAll} />
        <PlainTextField term={termMap.verbatimLocality} showDetails={showAll} />

        <PlainTextField
          term={termMap.minimumDistanceAboveSurfaceInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.maximumDistanceAboveSurfaceInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.locationAccordingTo}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.locationRemarks} showDetails={showAll} />

        <PlainTextField term={termMap.decimalLatitude} showDetails={showAll} />
        <PlainTextField term={termMap.decimalLongitude} showDetails={showAll} />
        <PlainTextField
          term={termMap.coordinateUncertaintyInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.coordinatePrecision}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.pointRadiusSpatialFit}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.footprintWKT} showDetails={showAll} />
        <PlainTextField term={termMap.footprintSRS} showDetails={showAll} />
        <PlainTextField term={termMap.verticalDatum} showDetails={showAll} />
        <PlainTextField
          term={termMap.footprintSpatialFit}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.verbatimCoordinateSystem}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.verbatimSRS} showDetails={showAll} />

        <PlainTextField term={termMap.georeferencedBy} showDetails={showAll} />
        <PlainTextField
          term={termMap.georeferencedDate}
          showDetails={showAll}
        />
        <HtmlField term={termMap.georeferenceProtocol} showDetails={showAll} />
        <HtmlField term={termMap.georeferenceSources} showDetails={showAll} />
        <PlainTextField
          term={termMap.georeferenceVerificationStatus}
          showDetails={showAll}
        />
        <HtmlField term={termMap.georeferenceRemarks} showDetails={showAll} />

        <PlainTextField term={termMap.elevation} showDetails={showAll} />
        <PlainTextField
          term={termMap.elevationAccuracy}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.minimumElevationInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.maximumElevationInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.verbatimElevation}
          showDetails={showAll}
        />

        <PlainTextField term={termMap.depth} showDetails={showAll} />
        <PlainTextField term={termMap.depthAccuracy} showDetails={showAll} />
        <PlainTextField
          term={termMap.minimumDepthInMeters}
          showDetails={showAll}
        />
        <PlainTextField
          term={termMap.maximumDepthInMeters}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.verbatimDepth} showDetails={showAll} />

        <PlainTextField term={termMap.geodeticDatum} showDetails={showAll} />
        <PlainTextField
          term={termMap.verbatimCoordinates}
          showDetails={showAll}
        />
        <PlainTextField term={termMap.verbatimLatitude} showDetails={showAll} />
        <PlainTextField
          term={termMap.verbatimLongitude}
          showDetails={showAll}
        />
      </Properties>
    </Group>
  );
}
