import { css } from '@emotion/react';
import React, { useContext } from 'react';
import get from 'lodash/get';
import union from 'lodash/union';
import { FilterContext, withFilter } from '../../widgets/Filter/state';
import ThemeContext from '../../style/themes/ThemeContext';
import { Trigger as MetaFilter } from '../../widgets/Filter/types/MetaFilter';
import { Button, Tooltip } from '../../components';
import { MdDelete, MdFilterAlt } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import SiteContext from '../../dataManagement/SiteContext';

function getVisibleFilters(currentFilter, commonFilters) {
  const visibleFilters = union(
    commonFilters,
    Object.keys(get(currentFilter, 'must', {})),
    Object.keys(get(currentFilter, 'must_not', {}))
  );
  return visibleFilters;
}

const FilterBar = ({ className = '', config, filter, label, ...props }) => {
  const theme = useContext(ThemeContext);
  const currentFilterContext = useContext(FilterContext);
  const { event: eventConfig } = useContext(SiteContext);

  const prefix = theme.prefix || 'gbif';
  const elementName = 'filterBar';

  const visibleFilters = getVisibleFilters(
    filter,
    config.defaultVisibleFilters
  );
  const availableFilters = visibleFilters.map((x) => config.filters[x]);
  const currentFilters = Object.keys({
    ...(currentFilterContext.filter.must || {}),
    ...(currentFilterContext.filter.must_not || {}),
  });

  return (
    <div
      className={`${className} ${prefix}-${elementName}`}
      css={css`
        ${style(theme)}
      `}
      {...props}
    >
      <div>
        <div
          css={css`
            display: flex;
            align-items: center;
            padding-right: 12px;
            margin-right: 12px !important;
            border-right: 1px solid ${theme.paperBorderColor};
          `}
        >
          <MdFilterAlt
            css={css`
              margin-right: 8px;
              font-size: 20px;
            `}
          />
          <span
            css={css`
              font-weight: bold;
            `}
          >
            <FormattedMessage id='search.filters' defaultMessage='Filters' />
          </span>
        </div>
        {availableFilters.map((x, i) => {
          if (!x) return null; // if no widget is defined for this filter, then do not show anything
          return <x.Button key={i} />;
        })}
        {Object.keys(config.filters).length !==
          config.defaultVisibleFilters.length && (
          <div>
            <MetaFilter />
          </div>
        )}
      </div>
      {currentFilters.length > 0 && eventConfig?.enableResetFilter && (
        <Tooltip title='Clear all filters' placement='auto'>
          <Button
            onClick={() => currentFilterContext.setFilter({})}
            appearance='link'
            css={css`
              margin-right: 20px;
            `}
          >
            <MdDelete
              css={css`
                margin-top: 8px;
                font-size: 20px;
              `}
            />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

FilterBar.propTypes = {};

export const style = (theme) => css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: -4px;
  }
  > div > div {
    max-width: 100%;
    margin-right: 4px;
    margin-bottom: 4px;
  }
`;

const mapContextToProps = ({ filter }) => ({ filter });
export default withFilter(mapContextToProps)(FilterBar);
