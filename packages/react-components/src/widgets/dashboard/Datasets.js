import { jsx, css } from '@emotion/react';
import React, { useState, useCallback } from 'react';
import { Card, CardTitle } from './shared';
import { GroupByTable } from './GroupByTable';
import { Button, ResourceLink } from '../../components';

import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';


export function Datasets({
  predicate,
  ...props
}) {
  return <Card {...props}>
    <CardTitle>Datasets</CardTitle>
    <GroupBy {...{
      predicate, query: DATASET_FACETS, transform: data => {
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


export function Taxa({
  predicate,
  ...props
}) {
  return <Card {...props}>
    <CardTitle>Families</CardTitle>
    <GroupBy {...{
      predicate, query: TAXON_FACETS, stransform: data => {
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
const TAXON_FACETS = `
query summary($predicate: Predicate, $size: Int, $from: Int){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: familyKey
    }
    facet {
      results: familyKey(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
        }
      }
    }
  }
}
`;

function GroupBy({ predicate, query, transform, ...props }) {
  const { data, results, loading, error, next, prev, first, isLastPage, isFirstPage, total, distinct } = useFacets({ predicate, query });
  const mappedResults = transform ? transform(data) : results;
  return <>
    <div css={css`font-size: 13px; color: #888; margin-bottom: 8px;`}>{distinct} results</div>
    <GroupByTable results={mappedResults} total={total} {...props} />
    <div css={css`margin-left: auto; font-size: 12px;`}>
      {!(isLastPage && isFirstPage) && <Button look="ghost" onClick={prev} css={css`margin-right: 8px; `} disabled={isFirstPage}>Previous</Button>}
      {!isLastPage && <Button look="ghost" onClick={next}>Next</Button>}
    </div>
  </>
}

function useFacets({ predicate, query, size = 10 }) {
  const [from = 0, setFrom] = useState(0);
  const { data, error, loading, load } = useQuery(query, { lazyLoad: true });

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate,
        from,
        size,
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate, from, size]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  const results = data?.occurrenceSearch?.facet?.results?.map(x => {
    return {
      key: x.key,
      title: x?.entity?.title,
      count: x.count,
      description: x?.entity?.description
    }
  });

  return {
    data, results, loading, error,
    next, prev, first,
    isLastPage: data?.occurrenceSearch?.cardinality?.total <= from + size,
    isFirstPage: from === 0,
    total: data?.occurrenceSearch?.documents?.total,
    distinct: data?.occurrenceSearch?.cardinality?.total
  };
}