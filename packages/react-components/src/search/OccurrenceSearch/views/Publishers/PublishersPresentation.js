/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdHelp } from "react-icons/md";
import { FormattedNumber } from 'react-intl';
import get from 'lodash/get';
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { Progress, Row, Col, DetailsDrawer } from '../../../../components';
import { PublisherSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
import * as styles from '../Datasets/datasetPresentation.styles';

export const PublishersPresentation = ({ more, size, data, total, loading }) => {
  const { labelMap } = useContext(OccurrenceContext);
    console.log(data)
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true });

  const items = data?.occurrenceSearch?.facet?.publishingOrganizationKey || [];
  const cardinality = data?.occurrenceSearch?.cardinality?.publishingOrganizationKey;

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

  return <>
    <DetailsDrawer href={`https://www.gbif.org/publisher/${activeItem?.publisher?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
       <PublisherSidebar id={activeItem?.publisher?.key} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} />
    </DetailsDrawer>
    <div >
      <ViewHeader loading={loading} total={cardinality}/>
      {/* <Row direction="row-reverse">
        <Col><MdHelp /></Col>
      </Row> */}
      <div>
        <ul style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li>
            <PublisherResult setActive={setActive} index={index} dialog={dialog} key={item.key} item={item} largest={items[0].count} />
          </li>)}
        </ul>
      </div>
    </div>
  </>
}

function PublisherResult({ largest, item, indicator, theme, setActive, index, dialog, ...props }) {
  return <div css={styles.dataset({ theme })}>
    <a css={styles.actionOverlay({theme})} href={`https://www.gbif.org/publisher/${item.publisher.key}`} onClick={(event) => {
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey || // apple
        (event.button && event.button == 1) // middle click, >IE9 + everyone else
      ) {
        return;
      } else {
        setActive(index);
        dialog.show();
        event.preventDefault();
      }
    }}></a>
    <div css={styles.title({ theme })}>
      <div style={{ flex: '1 1 auto' }}>
        {item.publisher.title}</div>
      <span><FormattedNumber value={item.count} /></span>
    </div>
    <Progress percent={100 * item.count / largest} />
    {/* <Progress percent={indicator} /> */}
  </div>
}

// function getIndicatorValues(values) {
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const logMin = Math.log(min);
//   const logMax = Math.log(max);
//   const logStart = Math.max(0, Math.floor(logMin));
//   return values.map(x => x === 0 
//     ? 0 
//     : 100 * (Math.log(x) - logStart) / (logMax - logStart)
//     );
// }