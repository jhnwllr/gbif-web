import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        event(id: String!, preview: Boolean): Event!
    }

    type Event {
        id: ID!
        title: String!
        summary: String
        body: String
        previewText: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        start: String!
        end: String
        allDayEvent: Boolean
        organisingParticipants: [Participant]
        venue: String
        location: String
        country: String
        # TODO: Figure out what this is
        coordinates: String
        eventLanguage: String
        documents: [Document]
        attendees: String
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
        excerpt: String
    }
`

export default typeDef;