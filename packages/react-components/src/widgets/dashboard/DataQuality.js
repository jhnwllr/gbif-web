import { jsx, css } from '@emotion/react';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../dataManagement/api';
import { Progress } from '../../components';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Card, CardTitle, Table } from './shared';
import { MdChevronRight } from 'react-icons/md';

export function DataQuality({
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate,
        hasSpeciesRank: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'gbifClassification_classification_rank',
              value: 'SPECIES'
            }
          ]
        },
        hasCoordinates: {
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'hasCoordinate',
              value: true
            }
          ]
        },
        hasMedia: {
          type: 'and',
          predicates: [
            predicate,
            {
              "type": "isNotNull",
              "key": "mediaType"
            }
          ]
        },
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  if (error) return <span>Failure</span>
  if (!data || loading) return <span>Loading</span>

  const summary = data?.occurrenceSearch;

  return <Card {...props}>
    <CardTitle>Data quality</CardTitle>
    <div>
      <Table>
        <tbody css={css`
          >tr > td > div {
            display: flex;
            align-items: center;
          }
          /* td, td > div {
            text-overflow: ellipsis;
            white-space: nowrap;
          } */
          tr {
            td:last-of-type {
              width: 80px;
            }
          }
          
          `}>
          <tr>
            <td><div>Species level</div></td>
            <td><FormattedNumber value={data?.rank?.documents?.total} /></td>
            <td>
              <Progress percent={100 * data?.rank?.documents?.total / summary.documents.total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td>
          </tr>
          <tr>
            <td><div>With coordinates</div></td>
            <td><FormattedNumber value={data?.hasCoordinates?.documents?.total} /></td>
            <td>
              <Progress percent={100 * data?.hasCoordinates?.documents?.total / summary.documents.total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td>
          </tr>
          <tr>
            <td><div>With year</div></td>
            <td><FormattedNumber value={data?.rank?.documents?.total} /></td>
            <td>
              <Progress percent={100 * data?.rank?.documents?.total / summary.documents.total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td>
          </tr>
          <tr>
            <td><div>With media</div></td>
            <td><FormattedNumber value={data?.hasMedia?.documents?.total} /></td>
            <td>
              <Progress percent={100 * data?.hasMedia?.documents?.total / summary.documents.total} style={{ height: '1em', marginLeft: 'auto' }} />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Card>
};

const OCCURRENCE_STATS = `
query summary($predicate: Predicate, $hasSpeciesRank: Predicate, $hasCoordinates: Predicate, $hasMedia: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  rank: occurrenceSearch(predicate: $hasSpeciesRank) {
    documents(size: 0) {
      total
    }
  }
  hasCoordinates: occurrenceSearch(predicate: $hasCoordinates) {
    documents(size: 0) {
      total
    }
  }
  hasMedia: occurrenceSearch(predicate: $hasMedia) {
    documents(size: 0) {
      total
    }
  }
}
`;

