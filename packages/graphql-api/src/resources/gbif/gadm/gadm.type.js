import { gql } from 'apollo-server';

// since vocabulary search expose non releasd vocabularies, we will remove this option for now
// vocabularySearch(
//   limit: Int
//   offset: Int
//   q: String
//   name: String
//   deprecated: Boolean
//   key: ID
//   hasUnreleasedChanges: Boolean
//   namespace: String
// ): VocabularySearchResult

const typeDef = gql`
  extend type Query {
    gadm(id: ID!): Gadm
  }

  type Gadm {
    id: ID!
    name: String
    gadmLevel: Int
    higherRegions: [GadmHigherRegions]
    englishType: [String]
    type: [String]
    variantName: [String]
  }
  type GadmHigherRegions {
    id: String 
    name: String
  }
`;

export default typeDef;
