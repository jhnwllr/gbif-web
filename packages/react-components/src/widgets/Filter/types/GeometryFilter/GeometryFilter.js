
import { jsx, css } from '@emotion/react';
import get from 'lodash/get';
import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import PopoverFilter from '../PopoverFilter';
import { keyCodes } from '../../../../utils/util';
import { Option, Filter, SummaryBar, FilterBody, Footer } from '../../utils';
import { Button, ButtonGroup, Tooltip } from '../../../../components';
import { GeometryInput, isValidWKT } from './GeometryInput';
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
  const tab = useTabState({ selectedId: "gbifLocationTabGeometry" });
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

      const invalidWkt = <div style={{ color: 'tomato' }}><FormattedMessage id="filterSupport.location.invalidWkt" /></div>;

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
              margin-bottom: 12px;
            }`}>
            <fieldset css={css`${fieldStyle}; `}>
              <div css={css`margin-inline-end: 6px;`}>
                <ButtonGroup style={{ fontSize: 13 }}>
                  <Button look={hasCoordinateValue === 'true' ? 'primary' : 'primaryOutline'} as="label" >
                    <input css={srOnly} type="radio" name="hasCoordinate" value="true" checked={hasCoordinateValue === 'true'} onChange={() => {
                      setFullField('hasCoordinate', ['true'])
                    }} />
                    <FormattedMessage id="search.ternary.yes" />
                  </Button>
                  <Button look={hasCoordinateValue === 'false' ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasCoordinate" value="false" checked={hasCoordinateValue === 'false'} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, ['false']);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                      setFilter(newFilter);
                    }} />
                    <FormattedMessage id="search.ternary.no" />
                  </Button>
                  <Button look={hasCoordinateValue === undefined ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasCoordinate" value="" checked={hasCoordinateValue === undefined} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, []);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                      setFilter(newFilter);
                    }} />
                    <FormattedMessage id="search.ternary.either" />
                  </Button>
                </ButtonGroup>
              </div>
              <legend css={fieldLegendStyle}><FormattedMessage id="filters.hasCoordinate.name" /></legend>
            </fieldset>

            <fieldset css={fieldStyle}>
              <legend css={fieldLegendStyle}><FormattedMessage id="filters.hasGeospatialIssues.name" /></legend>
              <div>
                <ButtonGroup style={{ fontSize: 13 }}>
                  <Button look={hasGeospatialIssue === 'true' ? 'primary' : 'primaryOutline'} as="label" >
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="true" checked={hasGeospatialIssue === 'true'} onChange={() => {
                      const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                      set(newFilter, `must.hasCoordinate`, ['true']);
                      set(newFilter, `must.hasGeospatialIssue`, ['true']);
                      setFilter(newFilter);
                    }} />
                    <FormattedMessage id="search.ternary.yes" />
                  </Button>
                  <Button look={hasGeospatialIssue === 'false' ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="false" checked={hasGeospatialIssue === 'false'} onChange={() => {
                      setFullField('hasGeospatialIssue', ['false'])
                    }} />
                    <FormattedMessage id="search.ternary.no" />
                  </Button>
                  <Button look={hasGeospatialIssue === undefined ? 'primary' : 'primaryOutline'} as="label">
                    <input css={srOnly} type="radio" name="hasGeospatialIssue" value="" checked={hasGeospatialIssue === undefined} onChange={() => {
                      setFullField('hasGeospatialIssue', [])
                    }} />
                    <FormattedMessage id="search.ternary.either" />
                  </Button>
                </ButtonGroup>
              </div>
            </fieldset>
          </div>

          <div css={css`
            margin: 12px 0;
          `}>
            <div css={css`
              font-size: 13px; 
              padding-bottom: 6px;
              `}>
              <TabList {...tab} aria-label="Input type">
                <Tab {...tab} css={tabStyle} id="gbifLocationTabGeometry"><FormattedMessage id="filterSupport.location.geometry" /></Tab>
                <Tab {...tab} css={tabStyle} id="gbifLocationTabRange"><FormattedMessage id="filterSupport.location.range" /></Tab>
                <Tab {...tab} css={tabStyle} id="gbifLocationTabRecent"><FormattedMessage id="filterSupport.location.recent" /></Tab>
              </TabList>
            </div>
            <TabPanel {...tab} css={tapPanelStyle}>
              <GeometryInput onApply={({ wkt }) => {
                const allOptions = [...new Set([...wkt, ...options])]
                setOptions(allOptions);
                toggle(filterHandle, wkt);
              }} />

            </TabPanel>
            <TabPanel {...tab} css={tapPanelStyle}>
              <RangeInput onApply={({ wkt }) => {
                const allOptions = [...new Set([...wkt, ...options])]
                setOptions(allOptions);
                toggle(filterHandle, wkt);
              }} />
            </TabPanel>
            <TabPanel {...tab} css={tapPanelStyle}>
              {tab.selectedId === "gbifLocationTabRecent" && visibleRecentGeometries && visibleRecentGeometries.length > 0 && <>
                {visibleRecentGeometries
                  .map((concept, index) => {
                    const isValid = isValidWKT(concept);
                    return <Option
                      key={concept}
                      helpVisible={true}
                      helpText={isValid ? <HelpText id={concept} /> : invalidWkt}
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

          {visibleOptions.length > 0 && <div>
            {visibleOptions.map((concept, index) => {
              const isValid = isValidWKT(concept);
              return <Option
                innerRef={index === 0 ? focusRef : null}
                key={concept}
                helpVisible={true}
                helpText={isValid ? <HelpText id={concept} /> : invalidWkt}
                label={<div>{truncate(concept, 70)} <CopyToClipboard text={concept} /></div>}
                checked={checkedMap.has(concept)}
                onChange={() => {
                  toggle(filterHandle, concept);
                }}
              />
            })}
          </div>}
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
    background: #666;
    /* background: var(--primary); */
    color: #fff;
  }
`

const tapPanelStyle = css`
  margin: 0 -8px;
  padding: 8px;
  box-shadow: 0 5px 10px 4px rgba(0,0,0,0.06);
  border: 1px solid #f4f4f4;
`;

const longWkt = 'POLYGON ((-77.9947 1.17549, -78.00474 1.17844, -78.0114 1.17485, -78.01342 1.17086, -78.01644 1.17055, -78.02381 1.16408, -78.0243 1.15419, -78.01835 1.14472, -78.00381 1.13924, -78.01975 1.13367, -78.02896 1.13356, -78.0281 1.13201, -78.01705 1.12732, -78.01774 1.12148, -78.01038 1.11913, -78.0017 1.11958, -77.9982 1.12528, -77.99491 1.12443, -77.98173 1.12604, -77.97471 1.12787, -77.97187 1.13056, -77.92519 1.09393, -77.9309 1.10021, -77.93105 1.10578, -77.92926 1.10935, -77.93045 1.11671, -77.94068 1.12131, -77.94868 1.12767, -77.94914 1.13826, -77.95467 1.14503, -77.95234 1.1586, -77.95567 1.15964, -77.96521 1.15366, -77.96831 1.16035, -77.96181 1.16622, -77.96546 1.17221, -77.97352 1.16251, -77.973 1.15999, -77.9778 1.16698, -77.98349 1.16447, -77.988 1.16513, -77.9897 1.16676, -77.98818 1.16902, -77.98901 1.17219, -77.99105 1.17156, -77.99168 1.17482, -77.9947 1.17549))';