const _ = require('lodash');
const allowedTypes = ['facet', 'stats', 'cardinality', 'multifacet'];

function get2metric(query, config) {
  // query example: {facet: [year, datasetKey], stats: year, facet.size.year:3}
  const parsedQuery = Object.keys(query).reduce((acc, cur) => {
    // only consider keys starting with the allowed types (facet, stats, etc.)
    const firstPart = cur.split('.')[0];
    if (!allowedTypes.includes(firstPart)) return acc;

    if (cur.includes('.')) {
      return _.set(acc, cur, query[cur]);
    } else {
      // else assign value to a 'value' field
      return _.set(acc, `${cur}.value`, query[cur]);
    }
  }, {});

  let metrics = {};
  for (let [type, conf] of Object.entries(parsedQuery)) {
    const keys = Array.isArray(conf.value) ? conf.value : conf.value.split(",");
    if (type == "multifacet"){
      const size = parseInt(_.get(conf, `size.${keys[0]}`, 10));
      const from = parseInt(_.get(conf, `from.${keys[0]}`, 0));
      const include = _.get(conf, `include.${keys[0]}`);
      const key = `${keys.join('-')}`;
      metrics[`${key}_${type}`] = {
        type,
        key,
        keys,
        ...(size && { size }),
        ...(from && { from }),
        ...(include && { include }),
      };

    } else {
      keys.filter(key => config.options[key]).forEach(key => {
        const size = parseInt(_.get(conf, `size.${key}`, 10));
        const from = parseInt(_.get(conf, `from.${key}`, 0));
        const include = _.get(conf, `include.${key}`);
        metrics[`${key}_${type}`] = {
          type,
          key,
          ...(size && { size }),
          ...(from && { from }),
          ...(include && { include }),
        }
      });
    }
  }
  return metrics;
}

module.exports = {
  get2metric
}