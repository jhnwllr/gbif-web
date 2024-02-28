
import { jsx, css } from '@emotion/react';
import get from 'lodash/get';
import React, { useContext, useState } from "react";
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



export const FilterContent = ({ config, translations, LabelFromID, hide, labelledById, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const [id] = useState(nanoid);
  const apiClient = useContext(ApiContext);
  const mustOptions = get(initFilter, `must.${filterHandle}`, []);
  // const [options, setOptions] = useState(mustOptions);
  const [options, setOptions] = useState(['POLYGON((16.56061 43.57267,-12.08918 25.23006,6.24729 -16.26213,51.59079 -10.77563,16.56061 43.57267))']);
  const HelpText = getHelpTextComponent({ apiClient });

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
    {({ helpVisible, toggle, setFullField, filter, checkedMap, formId, summaryProps, footerProps }) => {
      const hasCoordinateValue = get(filter, `must.hasCoordinate[0]`);
      const hasGeospatialIssue = get(filter, `must.hasGeospatialIssue[0]`);
      return <>
        <SummaryBar {...summaryProps} />
        <FilterBody css={css`max-height: none;`}
          onKeyPress={e => {
            if (e.shiftKey && e.which === keyCodes.ENTER) onApply({ filter, hide });
          }}>

          <div>Has coordinates</div>
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
                  setFullField('hasCoordinate', ['false'])
                }} />
                No
              </Button>
              <Button look={hasCoordinateValue === undefined ? 'primary' : 'primaryOutline'} as="label">
                <input css={srOnly} type="radio" name="hasCoordinate" value="" checked={hasCoordinateValue === undefined} onChange={() => {
                  setFullField('hasCoordinate', [])
                }} />
                Either
              </Button>
            </ButtonGroup>
          </div>

          <div>Has geospatial issues</div>
          <div>
            <ButtonGroup style={{ fontSize: 13 }}>
              <Button look={hasGeospatialIssue === 'true' ? 'primary' : 'primaryOutline'} as="label" >
                <input css={srOnly} type="radio" name="hasGeospatialIssue" value="true" checked={hasGeospatialIssue === 'true'} onChange={() => {
                  setFullField('hasGeospatialIssue', ['true']);
                  // setFullField('hasCoordinate', ['true']);
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

          <div>
            {options.map((concept, index) => {
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
          </div>

          <RangeInput onApply={({ wkt }) => {
            const allOptions = [...new Set([...wkt, ...options])]
            setOptions(allOptions);
            toggle(filterHandle, wkt);
          }} />

          <GeometryInput onApply={({ wkt }) => {
            const allOptions = [...new Set([...wkt, ...options])]
            setOptions(allOptions);
            toggle(filterHandle, wkt);
          }} />
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

function truncate(str, n) {
  return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
}

function CopyToClipboard({ text }) {
  return <Tooltip title={<FormattedMessage id="phrases.copyToClipboard" />}>
    <Button look="text" onClick={() => navigator.clipboard.writeText(text)}>
      <CopyToClipboardIcon />
    </Button>
  </Tooltip>
}

function getHelpTextComponent({ apiClient }) {
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