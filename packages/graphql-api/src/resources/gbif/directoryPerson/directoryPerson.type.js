import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    directoryPersonSearch(
      limit: Int
      offset: Int
      role: String
    ): DirectoryPersonSearchResults
    directoryPerson(key: String!): DirectoryPerson
  }

  type DirectoryPersonSearchResults {
    results: [JSON]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryPersonStub {
    id: ID!
    firstName: String
    surname: String
    title: String
    orcidId: String
    jobTitle: String
    institutionName: String
    email: String
    phone: String
    address: String
    countryCode: Country
    comments: String
    countryName: String
  }

  type DirectoryPerson {
    id: ID!
    firstName: String
    surname: String
    title: String
    orcidId: String
    jobTitle: String
    institutionName: String
    email: String
    secondaryEmail: String
    phone: String
    skype: String
    address: String
    countryCode: String
    fax: String
    comments: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    countryName: String
    roles: [String]
    certifications: [Certification]
    languages: [String]
    areasExpertise: [String]
    profileDescriptions: [ProfileDescription]
  }

  type Certification {
    key: Int
    title: String
    level: String
    year: Int
    createdBy: String
    created: String
  }
  
  type ProfileDescription {
    key: Int
    language: String
    description: String
    createdBy: String
    created: String
    modifiedBy: String
    modified: String
  }
`;

export default typeDef;
