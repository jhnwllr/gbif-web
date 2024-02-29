
import { jsx, css } from '@emotion/react';
import get from 'lodash/get';
import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import PopoverFilter from '../PopoverFilter';
import { keyCodes } from '../../../../utils/util';
import { Option, Filter, SummaryBar, AdditionalControl, FilterBody, Footer, Exists } from '../../utils';
import { Button, ButtonGroup, Checkbox, Tooltip } from '../../../../components';
import { GeometryInput } from './GeometryInput';
import { HiOutlineClipboardCopy as CopyToClipboardIcon } from "react-icons/hi";
import { ApiContext } from '../../../../dataManagement/api';
import labelMaker from '../../../../utils/labelMaker/labelMaker';
import { srOnly } from '../../../../style/shared';
import { RangeInput } from './RangeInput';
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import { useLocalStorage } from 'react-use';
import set from 'lodash/set';


export const FilterContent = ({ config, translations, LabelFromID, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = useState(nanoid);
  const tab = useTabState({ selectedId: "gbifLocationTabRecent" });
  // const tab = useTabState({ selectedId: "gbifLocationTabGeometry" });
  const apiClient = useContext(ApiContext);
  const HelpText = getHelpTextComponent({ apiClient });
  const mustOptions = get(initFilter, `must.${filterHandle}`, []);
  const [options, setOptions] = useState(mustOptions);
  const [recentGeometries, setRecentGeometries, removeRecentGeometries] = useLocalStorage('recentGeometries', []);

  // add the options to the list of recet geometries
  useEffect(() => {
    if (options.length > 0) {
      // add the options to the list of recet geometries. But keep the ordering, with the most recent on top. and remove duplicates. And only store the last 20
      const newRecentGeometries = [...new Set([...options, ...recentGeometries])].slice(0, 20);
      setRecentGeometries(newRecentGeometries);
    }
  }, [options]);

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    hasHelpTexts={config.hasOptionDescriptions}
    aboutText={translations.description && <FormattedMessage
      id={translations.description || `filters.${filterHandle}.description`}
      defaultMessage={translations.description}
    />}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
    defaultHelpVisible={config.showOptionHelp}
  >
    {({ helpVisible, toggle, setFullField, setFilter, filter, checkedMap, formId, summaryProps, footerProps }) => {
      const hasCoordinateValue = get(filter, `must.hasCoordinate[0]`);
      const hasGeospatialIssue = get(filter, `must.hasGeospatialIssue[0]`);
      const visibleRecentGeometries = (recentGeometries || []).filter(x => !checkedMap.has(x));
      const visibleOptions = options.filter(concept => checkedMap.has(concept));
      let filterCount = summaryProps.count;
      if (typeof hasCoordinateValue === 'string') filterCount++;
      if (typeof hasGeospatialIssue === 'string') filterCount++;
      const clearedFilter = JSON.parse(JSON.stringify(filter ?? {}));
      set(clearedFilter, `must.${filterHandle}`, []);
      set(clearedFilter, `must.hasCoordinate`, []);
      set(clearedFilter, `must.hasGeospatialIssue`, []);
      const onClear = () => setFilter(clearedFilter);

      return <>
        <SummaryBar {...summaryProps} count={filterCount} onClear={onClear} />
        <FilterBody css={css`max-height: none;`}
          onKeyPress={e => {
            if (e.shiftKey && e.which === keyCodes.ENTER) onApply({ filter, hide });
          }}>

          <div css={css`
            display: flex; 
            flex-wrap: wrap; 
            > fieldset {
              flex: 1 1 50%;
            }`}>
            <fieldset css={css`${fieldStyle};  `}>
              <div>
                <ButtonGroup style={{ fontSize: 13 }}>
                  <Button look={hasCoordinateValue === 'true' ? 'primary' : 'primaryOutline'} as="label" >
                    <input css={srOnly} type="radio" name="hasCoordinate" value="true" checked={hasCoordinateValue === 'true'} onChange={() => {
                      setFullField('hasCoordinate', ['true'])
                    }} />
                    Yes
                  </Button>
                  <Button look={hasCoordinateValue === 'false' ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasCoordinate" value="false" checked={hasCoordinateValue === 'false'} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, ['false']);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                      setFilter(newFilter);
                    }} />
                    No
                  </Button>
                  <Button look={hasCoordinateValue === undefined ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasCoordinate" value="" checked={hasCoordinateValue === undefined} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, []);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                      setFilter(newFilter);
                    }} />
                    Either
                  </Button>
                </ButtonGroup>
              </div>
              <legend css={fieldLegendStyle}>Has coordinates</legend>
            </fieldset>

            <fieldset css={fieldStyle}>
              <legend css={fieldLegendStyle}>Has geospatial issues</legend>
              <div>
                <ButtonGroup style={{ fontSize: 13 }}>
                  <Button look={hasGeospatialIssue === 'true' ? 'primary' : 'primaryOutline'} as="label" >
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="true" checked={hasGeospatialIssue === 'true'} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, ['true']);
                      set(newFilter, `must.hasGeospatialIssue`, ['true']);
                      setFilter(newFilter);
                    }} />
                    Yes
                  </Button>
                  <Button look={hasGeospatialIssue === 'false' ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="false" checked={hasGeospatialIssue === 'false'} onChange={() => {
                      setFullField('hasGeospatialIssue', ['false'])
                    }} />
                    No
                  </Button>
                  <Button look={hasGeospatialIssue === undefined ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="" checked={hasGeospatialIssue === undefined} onChange={() => {
                      setFullField('hasGeospatialIssue', [])
                    }} />
                    Either
                  </Button>
                </ButtonGroup>
              </div>
            </fieldset>
          </div>

          {visibleOptions.length > 0 && <div css={css`
            margin: 18px 0;
            padding: 18px 0;
            border: 1px solid rgb(229, 235, 237);
            border-width: 1px 0;
          `}>
            {visibleOptions.map((concept, index) => {
              return <Option
                innerRef={index === 0 ? focusRef : null}
                key={concept}
                helpVisible={true}
                helpText={<HelpText id={concept} />}
                label={<div>{truncate(concept, 70)} <CopyToClipboard text={concept} /></div>}
                checked={checkedMap.has(concept)}
                onChange={() => {
                  toggle(filterHandle, concept);
                }}
              />
            })}
          </div>}

          <div css={css`
            margin: 18px 0;
          `}>
            <div css={css`
              font-size: 13px; 
              padding-bottom: 6px;
              `}>
              <TabList {...tab} aria-label="Input type">
                <Tab {...tab} css={tabStyle} id="gbifLocationTabGeometry">Geometry</Tab>
                <Tab {...tab} css={tabStyle} id="gbifLocationTabRange">Range</Tab>
                <Tab {...tab} css={tabStyle} id="gbifLocationTabRecent">Recently used</Tab>
              </TabList>
            </div>
            <TabPanel {...tab} css={tapPanelStyle}>
              <GeometryInput onApply={({ wkt }) => {
                const allOptions = [...new Set([...wkt, ...options])]
                setOptions(allOptions);
                toggle(filterHandle, wkt);
              }} />
              <div css={css`font-size: 13px; margin-top: 6px; color: #888;`}>
                Only WKT is supported, but we will attempt to convert any GeoJSON to WKT. If you have a large GeoJSON file, you can simplify it using MapShaper and convert to WKT using geojson.io. Notice that only POINT, LINESTRING, LINEARRING, POLYGON and MULTIPOLYGON are accepted WKT types.
              </div>
            </TabPanel>
            <TabPanel {...tab} css={tapPanelStyle}>
              <RangeInput onApply={({ wkt }) => {
                const allOptions = [...new Set([...wkt, ...options])]
                setOptions(allOptions);
                toggle(filterHandle, wkt);
              }} />
            </TabPanel>
            <TabPanel {...tab} css={tapPanelStyle}>
              {visibleRecentGeometries && visibleRecentGeometries.length > 0 && <>
                {visibleRecentGeometries
                  .map((concept, index) => {
                    return <Option
                      key={concept}
                      helpVisible={true}
                      helpText={<HelpText id={concept} />}
                      label={<div>{truncate(concept, 70)} <CopyToClipboard text={concept} /></div>}
                      checked={false}
                      onChange={() => {
                        const allOptions = [...new Set([concept, ...options])]
                        setOptions(allOptions);
                        toggle(filterHandle, concept);
                      }}
                    />
                  })}
              </>}
              {visibleRecentGeometries && visibleRecentGeometries.length === 0 && <div css={css`font-size: 13px; color: #888; margin: 12px;`}>Geometries you have previously used will show here.</div>}
            </TabPanel>
          </div>




        </FilterBody>
        <Footer {...footerProps}
          onApply={() => onApply({ filter, hide })}
          onCancel={() => onCancel({ filter, hide })}
        />
      </>
    }}
  </Filter>
};

FilterContent.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onFilterChange: PropTypes.func,
  hide: PropTypes.func,
  focusRef: PropTypes.any,
  vocabulary: PropTypes.object,
  initFilter: PropTypes.object,
  filterHandle: PropTypes.string
};

export function Popover({ filterHandle, LabelFromID, translations = {}, config, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        LabelFromID={LabelFromID}
        translations={translations}
        config={config} />}
    />
  );
}

export function truncate(str, n) {
  return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
}

export function CopyToClipboard({ text }) {
  return <Tooltip title={<FormattedMessage id="phrases.copyToClipboard" />}>
    <Button look="text" onClick={() => navigator.clipboard.writeText(text)}>
      <CopyToClipboardIcon />
    </Button>
  </Tooltip>
}

export function getHelpTextComponent({ apiClient }) {
  const fetchFunction = ({ id }) => apiClient
    .get(`${apiClient.utils.endpoint}/polygon-name`, { params: { wkt: id } })
    .promise
    .then(res => res.data)
    .then(res => {
      return { title: truncate(res.title, 150) }
    });
  const Label = labelMaker(fetchFunction, { isHtmlResponse: false });
  return Label;
}

const fieldStyle = css`
  border: none; 
  padding: 0; 
  margin: 0;
`;

const fieldLegendStyle = css`
  padding: 0; 
  margin-bottom: 6px;
`;

const tabStyle = css`
  margin-inline-end: 6px;
  border: none;
  box-shadow: none;
  border-radius: 25px;
  padding: 3px 10px;
  margin: 3px 3px 3px 0;
  display: inline-block;
  font-weight: 400;
  background: #efefef;
  margin-inline-end: 6px;
  // style if attribute aria-selected is true
  &[aria-selected="true"] {
    background: var(--primary);
    color: #fff;
  }
`

const tapPanelStyle = css`
  margin: 0 -8px;
  padding: 8px;
  box-shadow: 0 5px 10px 4px rgba(0,0,0,0.06);
  border: 1px solid #f4f4f4;
`;