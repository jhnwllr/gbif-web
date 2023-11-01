/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import pick from 'lodash/pick';
import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';

class DirectoryPersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
    console.log(config.apiv1);
  }

  willSendRequest(request) {
    const header = createSignedGetHeader(request.path, this.config);
    Object.keys(header).forEach(x => request.headers.set(x, header[x]));
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
  reduceDirectoryPerson(directoryPerson) {
    return pick(directoryPerson, [
      'id',
      'firstName',
      'lastName',
      'created',
      'modified',
    ]);
  }

  async searchPeopleByRole({ query }) {
    const response = await this.get(
      '/directory/person_role',
      stringify(query, { indices: false }),
    );
    console.log(response);
    
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    // response.results = response.results.map((p) => this.reduceDirectoryPerson(p));
    return response;
  }

  async getDirectoryPersonByKey({ key }) {
    const directoryPerson = await this.get(`/directory/directoryPerson/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceDirectoryPerson(directoryPerson);
  }

  /*
  getDirectoryPersonsByKeys({ directoryPersonKeys }) {
    return Promise.all(
      directoryPersonKeys.map(key => this.getDirectoryPersonByKey({ key })),
    );
  }
  */
}

export default DirectoryPersonAPI;
