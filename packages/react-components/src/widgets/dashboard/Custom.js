import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Card, CardTitle } from './shared';
import { GroupBy, useFacets } from './charts/GroupByTable';
import { Button, ResourceLink, Classification, DropdownButton, Tooltip, Skeleton } from '../../components';
import { formatAsPercentage } from '../../utils/util';

import Highcharts from './charts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './charts/pie';
import { useIntl, FormattedMessage } from 'react-intl';

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
export function Taxa({
  predicate,
  ...props
}) {
  const [query, setQuery] = useState(getTaxonQuery('familyKey'));
  const [rank, setRank] = useState('FAMILY');
  const facetResults = useFacets({ predicate, query });
  return <Card {...props}>
    <CardTitle options={<DropdownButton
      look="primaryOutline"
      menuItems={menuState => majorRanks.map(rank => <DropdownButton.MenuAction onClick={e => { setRank(rank); setQuery(getTaxonQuery(`${rank}Key`)); menuState.hide() }}>
        <FormattedMessage id={`enums.taxonRank.${rank.toUpperCase()}`} defaultMessage={rank} />
      </DropdownButton.MenuAction>)}>
    </DropdownButton>}>
      <FormattedMessage id={`enums.taxonRank.${rank.toUpperCase()}`} defaultMessage={rank} />
    </CardTitle>
    <GroupBy {...{
      facetResults,
      transform: data => {
        return data?.occurrenceSearch?.facet?.results?.map(x => {
          return {
            key: x.key,
            title: x?.entity?.title,
            count: x.count,
            description: <Classification>
              {majorRanks.map(rank => {
                if (!x?.entity?.[rank]) return null;
                return <span key={rank}>{x?.entity?.[rank]}</span>
              })}
            </Classification>
          }
        });
      }
    }} />
  </Card>
};
const getTaxonQuery = rank => `
query summary($predicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: ${rank}
    }
    facet {
      results: ${rank}(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
          kingdom
          phylum
          class
          order
          family
          genus
        }
      }
    }
  }
}
`;

export function Iucn({
  predicate,
  ...props
}) {
  const facetResults = useFacets({
    predicate: {
      type: 'and',
      predicates: [
        predicate,
        {
          type: 'in',
          key: 'iucnRedListCategory',
          values: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT']
        }
      ]
    }, query: IUCN_FACETS
  });
  // consider a chart option where the chart is hidden if there is less than x results. e.g. zero or one result. Or perhaps even just a , "is meaningful" option, where to component itself evaluates wether it adds information. In some cases it would be nice just to add charts, but only having them show if there is rich data.
  //if (facetResults?.data?.occurrenceSearch?.facet?.results?.length === 0) return null;
  
  return <Card {...props}>
    <CardTitle>
      IUCN Threat Status
      <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
        <div>Species that are near threatened or more vulnerable according to the Global IUCN Redlist</div>
      </div>
    </CardTitle>
    <GroupBy {...{
      facetResults,
      transform: data => {
        return data?.occurrenceSearch?.facet?.results?.map(x => {
          return {
            key: x.key,
            title: <div>
              <IucnCategory code={x?.entity?.iucnRedListCategory?.code} category={x?.entity?.iucnRedListCategory?.category} />
              {x?.entity?.title}</div>,
            count: x.count,
            description: <Classification>
              {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
                if (!x?.entity?.[rank]) return null;
                return <span key={rank}>{x?.entity?.[rank]}</span>
              })}
            </Classification>
          }
        });
      }
    }} />
  </Card>
};
const IUCN_FACETS = `
query summary($predicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: speciesKey
    }
    facet {
      results: speciesKey(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
          kingdom
          phylum
          class
          order
          family
          genus
          iucnRedListCategory {
            category
            code
          }
        }
      }
    }
  }
}
`;

function IucnCategory({ code, category }) {
  return <Tooltip title={<FormattedMessage id={`enums.threatStatus.${category}`} />}>
    <span css={css`
      background: #7a443a;
      color: white;
      padding: 3px 5px;
      font-size: 10px;
      font-weight: bold;
      border-radius: 3px;
      margin-right: 4px;
    `}>
      {code}
    </span>
  </Tooltip>
}
