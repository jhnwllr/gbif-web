// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.API_V1;

class CollectionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchCollections({ query }) {
    return this.get('/grscicoll/collection', query);
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
  }

  async getCollectionsByInstitutionKey({ key }) {
    return this.get('/grscicoll/collection', {institution: key}).then(res => res.results);
  }

  /*
  getCollectionsByKeys({ collectionKeys }) {
    return Promise.all(
      collectionKeys.map(key => this.getCollectionByKey({ key })),
    );
  }
  */
}

module.exports = CollectionAPI;