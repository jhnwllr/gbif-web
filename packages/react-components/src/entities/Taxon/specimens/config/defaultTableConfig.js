import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDehaze } from 'react-icons/md';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';
import { Tooltip, TextButton } from '../../../../components';

export default (intl) => ({
  columns: [
    {
      trKey: 'filters.catalogNumber.name',
      value: {
        key: 'occurrences',
        hideFalsy: true,
        formatter: (value, event) => <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip placement="top" title={<span><FormattedMessage id="filterSupport.viewDetails" /></span>}>
            <TextButton as="span" look="textHoverLinkColor" style={{ display: 'inline-flex', marginRight: 8 }}>
              <MdDehaze />
            </TextButton>
          </Tooltip>
          {value.results[0].catalogNumber}
        </div>
      }
    },
    // {
    //   trKey: 'filters.catalogNumber.name',
    //   value: {
    //     key: 'occurrences',
    //     hideFalsy: true,
    //     formatter: ({ results }) => {
    //       return results[0] ? results[0].catalogNumber : 'N/A'
    //     }
    //   },
    // },
    // {
    //   trKey: 'filters.eventType.name',
    //   value: {
    //     key: 'eventType.concept',
    //     hideFalsy: true,
    //     formatter: (value, event) => (
    //       <div style={{ display: 'flex', alignItems: 'center' }}>
    //         <div>
    //           <InlineFilterChip
    //             filterName='eventType'
    //             values={[event.eventType.concept]}
    //           >
    //             <span
    //               dangerouslySetInnerHTML={{ __html: value }}
    //               data-loader
    //             ></span>
    //           </InlineFilterChip>
    //         </div>
    //       </div>
    //     ),
    //   },
    // },
    // {
    //   trKey: 'filters.dataStructure.name',
    //   value: {
    //     key: 'eventTypeHierarchyJoined',
    //     hideFalsy: true,
    //   },
    // },
    // {
    //   trKey: 'filters.samplingProtocol.name',
    //   value: {
    //     key: 'samplingProtocol',
    //     hideFalsy: true,
    //   },
    // },
    {
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey',
      value: {
        key: 'datasetKey',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='datasetKey'
                values={[event.datasetKey]}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: event.datasetTitle }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
      width: 'wide',
    },
    {
      trKey: 'filters.month.name',
      filterKey: 'month',
      value: {
        key: 'month',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='month' values={[event.month]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: `enums.month.${event.month}`,
                    }),
                  }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    {
      trKey: 'filters.year.name',
      filterKey: 'year',
      value: {
        key: 'year',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='year' values={[event.year]}>
                <span
                  dangerouslySetInnerHTML={{ __html: event.year }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    {
      trKey: 'filters.locationID.name',
      filterKey: 'locationID',
      value: {
        key: 'locationID',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='locationID'
                values={[event.locationID]}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: event.locationID }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    // {
    //   name: 'coordinates',
    //   trKey: 'filters.coordinates.name',
    //   value: {
    //     key: 'formattedCoordinates',
    //   },
    //   noWrap: true,
    // },
    {
      name: 'stateProvince',
      trKey: 'filters.stateProvince.name',
      value: {
        key: 'stateProvince',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='stateProvince'
                values={[event.stateProvince]}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: event.stateProvince }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    // {
    //   name: 'countryCode',
    //   trKey: 'filters.country.name',
    //   value: {
    //     key: 'countryCode',
    //     labelHandle: 'countryCode',
    //   },
    // },
    // {
    //   name: 'measurementOrFactTypes',
    //   trKey: 'filters.measurementOrFactTypes.name',
    //   value: {
    //     key: 'measurementOrFactTypes',
    //     formatter: (value, item) => (
    //       <>{(value || []).slice(0, 10).join(', ')}</>
    //     ),
    //   },
    // },
    // {
    //   name: 'occurrenceCount',
    //   trKey: 'tableHeaders.occurrences',
    //   value: {
    //     key: 'occurrenceCount',
    //     formatter: (value, item) => <FormattedNumber value={value} />,
    //     hideFalsy: true,
    //     rightAlign: true,
    //   },
    //   noWrap: true,
    // },
    // {
    //   name: 'speciesCount',
    //   trKey: 'tableHeaders.species',
    //   value: {
    //     key: 'speciesCount',
    //     formatter: (value, item) => <FormattedNumber value={value} />,
    //     hideFalsy: true,
    //     rightAlign: true,
    //   },
    //   noWrap: true,
    // },
  ],
});
