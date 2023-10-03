import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
    Query: {
        resourceSearch: async (_, args, context) => {
            // Validate the input arguments
            // if ((args.input.limit ?? 0) + (args.input.offset ?? 0) > 10000) throw new Error('The limit + offset cannot be greater than 10000');

            // Map the GraphQL input to the ElasticSearch input
            let elasticSearchInput = {
                q: args.input.q,
                size: args.input.limit,
                from: args.input.offset,
                // By default, restrict the search options to the ones the API supports
                contentType: args.input.contentTypes ?? Object.keys(SEARCH_RESULT_OPTIONS),
                topics: args.input.topics,
                countriesOfCoverage: args.input.countriesOfCoverage,
                countriesOfResearcher: args.input.countriesOfResearcher,
            }

            // Remove the null values from the input
            Object.entries(elasticSearchInput).forEach(([key, value]) => {
                if (key in elasticSearchInput && value == null) delete elasticSearchInput[key];
            });

            const searchResult = await context.dataSources.contentfulSearchAPI.search(elasticSearchInput, context.language);

            return {
                count: searchResult.results.length,
                endOfRecords: searchResult.total <= (searchResult.from + searchResult.size),
                limit: args.input.limit ?? 10,
                offset: searchResult.from,
                results: searchResult.results,
            }
        },
    },
    SingleSearchResult: {
        __resolveType: src => {
            const graphqlType = SEARCH_RESULT_OPTIONS[src.contentType];
            if (graphqlType) return graphqlType;
            console.warn(`Unknown content type in resourceSearch.resolver.js: ${src.contentType}`);
        },
    }
}

