import React from 'react';
import { Button, Popover } from '../../../../widgets/Filter/types/VocabularyFilter';
import formatFactory from '../../displayNames/formatFactory';
import { getVocabulary } from './getVocabulary';

export function generateFilter(config) {
  return {
    Button: props => <Button {...config} {...props} />,
    Popover: props => <Popover {...config} {...props} />,
    DisplayName: config.DisplayName
  }
}

function getGet(name) {
  return ({ lang = 'eng' }) => getVocabulary(name, lang)
}

function getDisplayName(name) {
  return formatFactory(id => getGet(name)({ lang: 'eng' })
    .then(vocab => {
      return {
        title: vocab.concepts.find(x => x.name === id).label
      }
    })
  );
}

export const lifeStageFilter = generateFilter({
  filterName: 'lifeStage',
  DisplayName: getDisplayName('lifeStage'),
  config: {
    getVocabulary: async () => {
      return {
        concepts: [{
          name: 'ADULT', definition: 'In adult life', label: 'Adult'
        }],
        definition: 'State of life lorem ipsum',
        label: 'Life stage',
        name: 'LifeStage',
        hasConceptDefinitions: true
      }
    }
  },
  ariaLabel: 'Filter on life state'
});

export const borFilter = generateFilter({
  filterName: 'basisOfRecord',
  trKey: 'filter.basisOfRecord',
  DisplayName: getDisplayName('BasisOfRecord'),
  config: {
    getVocabulary: getGet('BasisOfRecord')
  },
  ariaLabel: 'Filter on basis of record'
});

export const countryFilter = generateFilter({
  filterName: 'country',
  DisplayName: getDisplayName('Country'),
  config: {
    getVocabulary: getGet('Country')
  },
  ariaLabel: 'Filter on country'
});

export const typeStatusFilter = generateFilter({
  filterName: 'typeStatus',
  DisplayName: getDisplayName('TypeStatus'),
  config: {
    getVocabulary: getGet('TypeStatus')
  },
  ariaLabel: 'Filter on type status'
});