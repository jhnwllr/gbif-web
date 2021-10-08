
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdInsertPhoto, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import * as css from './styles';
import { useQuery } from '../../dataManagement/api';
import { OccurrencePresentation } from './OccurrencePresentation';
import { MemoryRouter } from 'react-router-dom';

export function Occurrence({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE, { lazyLoad: true });
  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  // return <MemoryRouter initialEntries={['/']}>
  //   <OccurrencePresentation {...{ data, error, loading: loading || !data, id }} />
  // </MemoryRouter>
  return <OccurrencePresentation {...{ data, error, loading: loading || !data, id }} />
};


const OCCURRENCE = `
query occurrence($key: ID!){
  occurrence(key: $key) {
    key
    coordinates
    countryCode
    eventDate
    typeStatus
    issues
    institution {
      name
      key
    }
    collection {
      name
      key
    }
    volatile {
      globe(sphere: false, land: false, graticule: false) {
        svg
        lat
        lon
      }
      features {
        isSpecimen
        isTreament
        isSequenced
        isClustered
        isSamplingEvent
      }
    }
    datasetKey,
    datasetTitle
    publishingOrgKey,
    publisherTitle,
    dataset {
      citation {
        text
      }
    }
    institutionCode
    recordedByIDs {
      value
      person(expand: true) {
        name
        birthDate
        deathDate
        image
      }
    }
    identifiedByIDs {
      value
      person(expand: true) {
        name
        birthDate
        deathDate
        image
      }
    }

    gadm

    stillImageCount
    movingImageCount
    soundCount
    stillImages {
      type
      format
      identifier
      created
      creator
      license
      publisher
      references
      rightsHolder
      description
    }

    gbifClassification {
      kingdom
      kingdomKey
      phylum
      phylumKey
      class
      classKey
      order
      orderKey
      family
      familyKey
      genus
      genusKey
      species
      speciesKey
      synonym
      classification {
        key
        rank
        name
      }
      usage {
        rank
        formattedName
        key
      }
      acceptedUsage {
        formattedName
        key
      }
    }

    primaryImage {
      identifier
    }

    terms {
      simpleName
      verbatim
      value
      htmlValue
      remarks
      issues
    }
  }
}
`;

