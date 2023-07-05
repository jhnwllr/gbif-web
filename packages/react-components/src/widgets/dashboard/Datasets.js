import { jsx, css } from '@emotion/react';
import React, { useState, useCallback } from 'react';
import { Card, CardTitle } from './shared';
import { GroupByTable } from './GroupByTable';
import { Button, ResourceLink, Classification, DropdownButton, Tooltip, Skeleton } from '../../components';
import { formatAsPercentage } from '../../utils/util';

import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';

import Highcharts from './highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getPieOptions } from './charts/pie';
import { useIntl, FormattedMessage } from 'react-intl';

export function Datasets({
  predicate,
  ...props
}) {
  const facetResults = useFacets({ predicate, query: DATASET_FACETS });
  return <Card {...props}>
    <CardTitle>Datasets</CardTitle>
    <GroupBy {...{
      facetResults,
      predicate,
      query: DATASET_FACETS,
      transform: data => {
        return data?.occurrenceSearch?.facet?.results?.map(x => {
          return {
            key: x.key,
            title: <ResourceLink discreet type="datasetKey" id={x.key}>{x?.entity?.title}</ResourceLink>,
            count: x.count,
            description: x.entity.description
          }
        });
      }
    }} />
  </Card>
};
const DATASET_FACETS = `
query summary($predicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: datasetKey
    }
    facet {
      results: datasetKey(size: $size, from: $from) {
        key
        count
        entity: dataset {
          title
        }
      }
    }
  }
}
`;

export function Preparations({
  predicate,
  ...props
}) {
  const facetResults = useFacets({
    size: 10,
    predicate,
    query: PREPARATIONS_FACETS,
    otherVariables: {
      hasPredicate: {
        type: 'and',
        predicates: [
          predicate,
          {
            type: 'isNotNull',
            key: 'preparations'
          }
        ]
      }
    }
  });

  const showChart = !facetResults.loading && facetResults?.data?.occurrenceSearch?.facet?.results?.length > 0;

  const data = facetResults?.data?.occurrenceSearch?.facet?.results?.map(x => {
    return {
      y: x.count,
      name: x.key,
    }
  });
  const serie = {
    name: 'Occurrences',
    colorByPoint: true,
    data
  };

  const options = getPieOptions({ serie, clickCallback: ({ filter } = {}) => console.log(filter), interactive: true });

  const filledPercentage = facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.occurrenceSearch?.documents?.total;
  return <Card {...props}>
    <CardTitle>
      Preparations
      <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
        <div>{formatAsPercentage(filledPercentage)}% filled</div>
      </div>
    </CardTitle>

    {showChart && <div style={{ margin: '24px auto' }}>
      {/* <div id="chart" style={{ maxWidth: 450, width: 'calc(100% - 1px)', margin: '0 auto' }}>
        <Chart theme={state.theme} options={state.options} series={state.series} type="pie" />
      </div> */}

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />

    </div>}
    <GroupBy facetResults={facetResults} />

    <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
      <p>Non-interpreted values - same concept might appear with different names.</p>
    </div>
  </Card>
};
const PREPARATIONS_FACETS = `
query summary($predicate: Predicate, $hasPredicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: preparations
    }
    facet {
      results: preparations(size: $size, from: $from) {
        key
        count
      }
    }
  }
  isNotNull: occurrenceSearch(predicate: $hasPredicate) {
    documents(size: 0) {
      total
    }
  }
}
`;


export function Taxa({
  predicate,
  ...props
}) {
  const [query, setQuery] = useState(getTaxonQuery('familyKey'));
  const [rank, setRank] = useState('FAMILY');
  const facetResults = useFacets({ predicate, query });
  return <Card {...props}>
    <CardTitle css={css`display: flex;`}>
      <div css={css`flex: 1 1 auto;`}>{rank}</div>
      <div css={css`flex: 0 0 auto; font-size: 13px;`}>
        <DropdownButton
          look="primaryOutline"
          menuItems={menuState => [
            <DropdownButton.MenuAction onClick={e => { setRank('KINGDOM'); setQuery(getTaxonQuery('kingdomKey')); menuState.hide() }}>Kingdoms</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('PHYLUM'); setQuery(getTaxonQuery('phylumKey')); menuState.hide() }}>Phyla</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('CLASS'); setQuery(getTaxonQuery('classKey')); menuState.hide() }}>Classes</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('ORDER'); setQuery(getTaxonQuery('orderKey')); menuState.hide() }}>Orders</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('FAMILY'); setQuery(getTaxonQuery('familyKey')); menuState.hide() }}>Families</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('GENUS'); setQuery(getTaxonQuery('genusKey')); menuState.hide() }}>Genera</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('SPECIES'); setQuery(getTaxonQuery('speciesKey')); menuState.hide() }}>Species</DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setRank('ANY_RANK'); setQuery(getTaxonQuery('taxonKey')); menuState.hide() }}>Any taxon</DropdownButton.MenuAction>,
          ]}>
          <Button onClick={e => {
            setRank('FAMILY');
            setQuery(getTaxonQuery('familyKey'));
          }}>Family</Button>
        </DropdownButton>
      </div>
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
  return <Card {...props}>
    <CardTitle>
      IUCN Threat Status
      <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
        <div>Specimens in the collection that are near threatened or more vulnerable according to the Global IUCN Redlist</div>
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


export function GroupBy({ facetResults, transform, ...props }) {
  const { data, results, loading, error, next, prev, first, isLastPage, isFirstPage, total, distinct } = facetResults;
  const mappedResults = transform ? transform(data) : results;
  return <>
    <div css={css`font-size: 13px; color: #888; margin-bottom: 8px;`}>
      {loading && <Skeleton as="div" width="100px" />}
      {!loading && <>{distinct} results</>}
    </div>
    <GroupByTable results={mappedResults} total={total} {...props} loading={loading} />
  </>
}

export function Pagging({ facetResults, ...props }) {
  const { next, prev, isLastPage, isFirstPage } = facetResults;
  if (isFirstPage && isLastPage) return null;
  return <div css={css`margin-left: auto; font-size: 12px;`}>
    {!(isLastPage && isFirstPage) && <Button look="ghost" onClick={prev} css={css`margin-right: 8px; `} disabled={isFirstPage}>Previous</Button>}
    {!isLastPage && <Button look="ghost" onClick={next}>Next</Button>}
  </div>
}

export function useFacets({ predicate, otherVariables = {}, keys, translationTemplate, query, size = 10 }) {
  const [from = 0, setFrom] = useState(0);
  const intl = useIntl();
  const { data, error, loading, load } = useQuery(query, { lazyLoad: true });

  useDeepCompareEffect(() => {
    load({
      keepDataWhileLoading: true,
      variables: {
        predicate,
        ...otherVariables,
        from,
        size,
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate, query, from, size]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  let results = data?.occurrenceSearch?.facet?.results?.map(x => {
    return {
      key: x.key,
      title: x?.entity?.title || x?.key,
      count: x.count,
      description: x?.entity?.description
    }
  });

  // If an explicit list of keys is provided, then use that order and fill missing results with count=0
  if (keys && Array.isArray(keys)) {
    results = keys.map(key => {
      const result = results ? results.find(x => x.key.toString() === key.toString()) : undefined;
      if (result) {
        return result;
      }
      return {
        key,
        title: key,
        count: 0,
        description: null
      }
    });
  }

  // if a translationTemplate of the form "something.else.{key}" is provided, then use that to translate the title
  if (translationTemplate && results?.length > 0) {
    results = results.map(x => {
      return {
        ...x,
        title: intl.formatMessage({ id: translationTemplate.replace('{key}', x.key) })
      }
    });
  }

  const distinct = data?.occurrenceSearch?.cardinality?.total ?? data?.occurrenceSearch?.facet?.results?.length ?? 0;

  const total = data?.occurrenceSearch?.documents?.total ?? 0;
  const isNotNull = data?.isNotNull?.documents?.total;
  // what is the sum of values in the current page. Sum the data?.occurrenceSearch?.facet?.results
  const pageSum = results?.reduce((acc, x) => acc + x.count, 0) ?? 0;
  // what is the difference between the total and the sum of the current page
  const otherOrEmptyCount = total - pageSum;
  const otherCount = isNotNull ? isNotNull - pageSum : total - pageSum;
  // how many entries have no value
  const emptyCount = isNotNull ? total - isNotNull : undefined;

  return {
    data, results, loading, error,
    next, prev, first,
    isLastPage: distinct <= from + size,
    isFirstPage: from === 0,
    total,
    distinct,
    otherCount,
    emptyCount,
    isNotNull,
    pageSum,
    otherOrEmptyCount
  };
}