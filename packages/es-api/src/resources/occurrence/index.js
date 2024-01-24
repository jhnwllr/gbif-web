const env = require('../../config');
const { config } = require('./occurrence.config');
const { get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { suggestGqlTypeFromAlias } = require('../../requestAdapter/util/suggestGraphqlType');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');
const { default: axios } = require('axios');
const predicate2v1 = require('../../requestAdapter/query/predicate2v1');

function suggestConfig() {
  return suggestConfigFromAlias({
    endpoint: env.occurrence.hosts[0],
    alias: 'occurrence',
    type: 'properties'
  });

  // return suggestGqlTypeFromAlias({ 
  //   endpoint: env.occurrence.hosts[0], 
  //   alias: 'occurrence', 
  //   type: 'record'
  // });
}

module.exports = {
  dataSource: require('./occurrence.dataSource'),
  get2predicate: query => get2predicate(query, config),
  get2query: predicate => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => {
    // transform predicate to use casing and types used by the (Java) GBIF API v1
    const { predicate: v1Predicate, error } = predicate2v1(predicate);
    if (!v1Predicate && !q) {
      return;
    }
    // call endpoint that translates predicate + q to ES query POST https://api.gbif-dev.org/v1/occurrence/search/predicate/toesquery body: {predicate, q}
    return axios.post(`${env.apiv1}/occurrence/search/predicate/toesquery`, { predicate: v1Predicate, q })
      .then(res => {
        console.log(res);
        return res.data;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  get2metric: query => get2metric(query, config),
  metric2aggs: metrics => metric2aggs(metrics, config),
  getSuggestQuery: ({ key, text }) => getSuggestQuery(key, text, config),
  suggestConfig
}

// suggestConfig().catch(err => console.log(err));