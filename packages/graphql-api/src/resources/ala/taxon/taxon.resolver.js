/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    taxon: (parent, { key }, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key, useBie: true }),
  },
  Taxon: {
    // dataset: ({ datasetKey }, args, { dataSources }) =>
    //   dataSources.datasetAPI.getDatasetByKey({ key: datasetKey }),
    // formattedName: ({ key }, args, { dataSources }) =>
    //   dataSources.taxonAPI.getParsedName({ key }),
    wikiData: ({ key }, args, { dataSources }) =>
      dataSources.wikidataAPI.getWikiDataTaxonData(key),
  },
};