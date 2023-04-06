import { gql } from 'apollo-server';

const typeDef = gql`
  type SeedBankExtension {
    id: String!
    degreeOfEstablishment: String
    accessionNumber: String
    seedPerGram: Int
    formInStorage: String
    sampleWeightInGrams: Float
    sampleSize: Int
    purityDebrisPercentage: Int
    purityPercentage: Int
    dateCollected: Long
    dateInStorage: Long
    storageTemperatureInCelsius: Int
    relativeHumidityPercentage: Int
    publicationDOI: String
    preStorageTreatmentNotesHistory: String
    primaryStorageSeedBank: String
    primaryCollector: String
    plantForm: String
    duplicatesReplicates: String
    collectionPermitNumber: String
    thousandSeedWeight: Float
    numberPlantsSampled: String
    storageBehaviour: String
    embryoType: String
    dormancyClass: String
    testDateStarted: Long
    testLengthInDays: Int
    collectionFillRate: String
    numberGerminated: Int
    germinationRateInDays: Int
    adjustedGerminationPercentage: Int
    viabilityPercentage: Int
    numberFull: Int
    numberEmpty: Int
    numberTested: Int
    preTestProcessingNotes: String
    pretreatment: String
    mediaSubstrate: String
    nightTemperatureInCelsius: Int
    dayTemperatureInCelsius: Int
    darkHours: Int
    lightHours: Int
  }
`;

export default typeDef;