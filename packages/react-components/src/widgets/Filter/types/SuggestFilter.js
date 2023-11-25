
import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { TriggerButton } from '../utils/TriggerButton';
import { nanoid } from 'nanoid';
import { FilterContext } from '../state';
import get from 'lodash/get';
import union from 'lodash/union';
import without from 'lodash/without';
import { keyCodes } from '../../../utils/util';
import PopoverFilter from './PopoverFilter';
import { Prose } from '../../../components/typography/Prose';
import { FilterBodyDescription } from '../utils/misc';
import { Suggest, Option, Filter, SummaryBar, FilterBody, Footer, Exists, AdditionalControl } from '../utils';
import { useQuery } from '../../../dataManagement/api';
import SearchContext from '../../../search/SearchContext';
import { filter2predicate } from '../../../dataManagement/filterAdapter';
import { Button } from '../../../components';

const initialSize = 25;

export const FilterContent = ({ config, translations, labelledById, LabelFromID, hide, onApply, onCancel, onFilterChange, focusRef, filterHandle, initFilter }) => {
  const { queryKey, query, facetsQuery, graph } = config;
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const currentFilterContext = useContext(FilterContext);
  const { data, error, loading, load } = useQuery(query, { lazyLoad: true, graph });
  const { data: dataFacets, error: errorFacets, loading: loadingFacets, load: loadFacets } = useQuery(facetsQuery, { lazyLoad: true, graph });
  const [size, setSize] = useState(initialSize);
  const [id] = React.useState(nanoid);
  const mustOptions = get(initFilter, `must.${filterHandle}`, []);
  const mustNotOptions = get(initFilter, `must_not.${filterHandle}`, []);

  const initialOptions = mustOptions.concat(mustNotOptions);
  const [options, setOptions] = useState(initialOptions.filter(x => x.type !== 'isNotNull'));
  const [showSuggestions, setShowSuggestions] = useState(true);//useState(initialOptions?.length === 0);

  let mustNotLength = get(initFilter, `must_not.${filterHandle}`, []).length;
  const [isNegated, setNegated] = useState(mustNotLength > 0 && config.supportsNegation);

  const suggestConfig = config.suggestConfig;
  const singleSelect = config.singleSelect;
  const Label = config.LabelFromID || LabelFromID;

  const aboutText = translations.description && <FormattedMessage
    id={translations.description || `filters.${filterHandle}.description`}
    defaultMessage={translations.description}
  />;

  useEffect(() => {
    if (typeof id !== 'undefined' && query) {
      const predicates = [
        // TODO the search function need to be defined in context
      ];
      if (rootPredicate) {
        predicates.push(rootPredicate);
      }
      // filter2predicate(currentFilterContext.filter, predicateConfig)
      const appliedFilter = JSON.parse(JSON.stringify(currentFilterContext.filter));
      delete appliedFilter['must'][filterHandle];
      delete appliedFilter?.['must_not']?.[filterHandle];
      const reducedPredicate = filter2predicate(appliedFilter, predicateConfig);

      load({
        keepDataWhileLoading: size > initialSize,
        variables: {
          size: size,
          predicate: {
            type: 'and',
            predicates: [...predicates, reducedPredicate]
          }
        }
      });
    }
  }, [size, id, rootPredicate]);

  useEffect(() => {
    if (typeof id !== 'undefined' && query) {
      const predicates = [
        // TODO the search function need to be defined in context
      ];
      if (rootPredicate) {
        predicates.push(rootPredicate);
      }

      const workingFilter = JSON.parse(JSON.stringify(currentFilterContext.filter));
      workingFilter.must[filterHandle] = options;
      const currentPredicate = filter2predicate(workingFilter, predicateConfig);

      loadFacets({
        keepDataWhileLoading: size > initialSize,
        variables: {
          size: options.length,
          predicate: {
            type: 'and',
            predicates: [...predicates, currentPredicate]
          },
        }
      });
    }
  }, [id, options, rootPredicate]);

  const loadMore = useCallback(() => {
    setSize(size + 50);
  }, [size]);

  const suggestions = data?.suggestions?.facet?.results || [];
  const facets = dataFacets?.selected?.facet?.results || [];
  // create map for easy facet lookup by key
  const facetMap = new Map();
  facets.forEach(facet => facetMap.set(facet.key, facet));
  

  return <Filter
    labelledById={labelledById}
    onApply={onApply}
    onCancel={onCancel}
    title={<FormattedMessage
      id={translations?.name || `filters.${filterHandle}.name`}
      defaultMessage={translations?.name}
    />}
    aboutText={aboutText}
    isNegated={isNegated}
    supportsExist={config.supportsExist}
    onFilterChange={onFilterChange}
    filterName={filterHandle}
    formId={id}
    defaultFilter={initFilter}
  >
    {({ filter, negateField, toggle, setFullField, checkedMap, formId, summaryProps, footerProps, isExistenceFilter }) => {
      // if there is both must and must_not filters, then we cannot show it. Simply tell the user that it is a complex filter and provide the option to clear it
      // at some point it would be nice to allow the user to edit the filter, but that is a bit more complex. Could perhaps just be as a json/text editor
      if (mustOptions.length > 0 && mustNotOptions.length > 0) {
        return <Prose as={FilterBodyDescription}>
          <FormattedMessage id="filterSupport.complexFilter" defaultMessage="This filter is more complex than what the UI support. Please clear it to edit it." />
        </Prose>
      }
      if (isExistenceFilter) {
        return <Exists {...{ footerProps, setFullField, onApply, onCancel, filter, hide, filterHandle }} />
      }
      // we need to know if there are more suggestions so we can show a 'more' button.
      const cardinality = data?.suggest?.cardinality?.[queryKey];
      const hasMoreSuggestions = cardinality ? suggestions?.length <= cardinality : suggestions?.length === size;
      return <>
        <Suggest
          {...suggestConfig}
          allowEmptyQueries={config?.specific?.allowEmptyQueries}
          focusRef={focusRef}
          onKeyPress={e => e.which === keyCodes.ENTER ? onApply({ filter, hide }) : null}
          /*onKeyPress={e => {
            if (e.which === keyCodes.ENTER) {
              if (e.target.value === '') {
                onApply({ filter, hide });
              } else {
                const val = e.target.value;
                const allOptions = union(options, [val]);
                setOptions(allOptions);
                toggle(filterHandle, val);
              }
            }
          }}*/
          onSuggestionSelected={({ item }) => {
            if (!item) return;
            const allOptions = union(options, [item.key]);
            setOptions(allOptions);
            if (singleSelect) {
              setOptions([item.key]);
              setFullField(filterHandle, [item.key], [])
                .then(responseFilter => onApply({ filter: responseFilter, hide }))
                .catch(err => console.log(err));
            } else {
              toggle(filterHandle, item.key, !isNegated);
            }
          }}
        />

        {config.supportsNegation && <AdditionalControl checked={isNegated} onChange={e => {
          negateField(filterHandle, !isNegated);
          setNegated(!isNegated);
        }}><FormattedMessage id="filterSupport.excludeSelected" defaultMessage="Exclude selected" /></AdditionalControl>}

        {options.length === 0 && config.showAboutAsDefault && typeof aboutText !== 'undefined' && <Prose as={FilterBodyDescription}>
          {aboutText}
        </Prose>}
        <SummaryBar {...summaryProps} style={{ marginTop: 4 }} />
        <FilterBody>
          <form id={formId} onSubmit={e => e.preventDefault()} >
            {showSuggestions && options.map((key) => {
              return <Option
                key={key}
                helpVisible={true}
                helpText={
                  !loading ? <FormattedMessage id="counts.nRecordsTotal" defaultMessage="{total} records in total"
                    values={{ total: facetMap.get(key)?.count }} /> : loading}
                label={<Label id={key} />}
                checked={checkedMap.has(key)}
                onChange={() => {
                  const allOptions = without(options, key);
                  setOptions(allOptions);
                  toggle(filterHandle, key, !isNegated)
                }}
              />
            })}

            {showSuggestions && <div style={options.length > 0 ? {marginTop: 12, paddingTop: 12, borderTop: '1px solid #ddd'} : {}}>
              {loading && !suggestions && <>
                <OptionSkeleton helpVisible />
                <OptionSkeleton helpVisible />
                <OptionSkeleton helpVisible />
              </>}
              {suggestions && <>
                {suggestions
                  .filter(option => !options.includes(option.key))
                  .map((option) => {
                  return <Option
                    key={option.key}
                    loading={loading}
                    helpVisible={true}
                    helpText={
                      <FormattedMessage id="counts.nRecordsTotal" defaultMessage="{total} records in total"
                        values={{ total: option.count }} />}
                        label={<Label id={option.key} />}
                    checked={checkedMap.has(option.key)}
                    onChange={() => {
                      const allOptions = union(options, [option.key]);
                      setOptions(allOptions);
                      toggle(filterHandle, option.key, !isNegated)
                    }}
                  />
                })}
                {hasMoreSuggestions && <div style={{ fontSize: 12, marginLeft: 24, marginTop: 12 }}><Button appearance="primaryOutline" onClick={loadMore}>
                  <FormattedMessage id="search.loadMore" defaultMessage="More" />
                </Button></div>}
              </>}
            </div>}
          </form>
        </FilterBody>
        <Footer {...footerProps}
          onApply={() => onApply({ filter, hide })}
          onCancel={() => onCancel({ filter, hide })}
        />
      </>
    }
    }
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

export function Popover({ filterHandle, LabelFromID, config, translations = {}, ...props }) {
  return (
    <PopoverFilter
      {...props}
      content={<FilterContent
        filterHandle={filterHandle}
        translations={translations}
        LabelFromID={LabelFromID}
        config={config} />}
    />
  );
}
