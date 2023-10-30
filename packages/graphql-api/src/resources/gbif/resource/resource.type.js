const { gql } = require("apollo-server");

const typeDef = gql`
  type Coordinates {
    lat: Float
    lng: Float
  }

  # All types that compose the Image type
  type ImageFileDetails {
    size: Int
    width: Int
    height: Int
  }

  type ImageFile {
    url: String
    details: ImageFileDetails
    fileName: String
    contentType: String
  }

  type AssetImage {
    file: ImageFile
    description: String
    title: String
  }

  # All types that compose the Link type
  type Link {
    label: String
    url: String
  }

  # All types that compose the Country type
  type Participant {
    country: String
    title: String
  }

  # All types that compose the DocumentAsset type
  type DocumentAssetFileDetails {
    size: Int
  }

  type DocumentAssetFile {
    url: String
    details: DocumentAssetFileDetails
    fileName: String
    contentType: String
  }

  type DocumentAsset {
    file: DocumentAssetFile
    description: String
    title: String
  }
`;

export default typeDef;