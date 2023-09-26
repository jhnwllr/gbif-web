import { gql } from "apollo-server-core";

const typeDef = gql`
    extend type Query {
        resourceSearch(input: ResourceSearchInput!): ContentSearchResult!
    }

    input ResourceSearchInput {
        q: String
        limit: Int
        offset: Int
        contentType: [String!]
        topics: [String!]
        countriesOfCoverage: [String!]
        countriesOfResearcher: [String!]
    }

    union SingleSearchResult = DataUse | Event | Notification | News

    type ContentSearchResult {
        results: [SingleSearchResult!]!
        limit: Int!
        offset: Int!
        count: Int!
        endOfRecords: Boolean!
    }
`;

export default typeDef;