import { RESTDataSource } from 'apollo-datasource-rest';

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class ContentAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async searchContentDocuments({ query, language }) {
    const response = await this.searchContent({ query, language });
    return response.documents;
  }

  async searchContent({ query, language }) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/content',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/content', body, {
        signal: this.context.abortController.signal,
      });
    }
    response._predicate = body.predicate;
    if (response?.documents?.results) response.documents.results = response.documents.results.map((x) =>
      pickLanguageRecursive({ item: x, language }),
    );
    return response;
  }

  async getContentByKey({ key, preview, language }) {
    const basePath = `/content/${key}`;
    const path = preview ? `${basePath}/preview?cachebust=${Date.now()}` : basePath;
    const item = await this.get(`${this.config.apiv1}${path}`);
    const languageSpecificRecord = pickLanguageRecursive({ item, language });
    return languageSpecificRecord;
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/content/meta', body);
    return response;
  }
}

// discard all but the target language from the response. Iterate through all nested fields. 
const defaultLanguage = 'en-GB';
function pickLanguageRecursive({ item, language }) {
  if (Array.isArray(item)) {
    return item.map(value => pickLanguageRecursive({item: value, language}));
  } else if (typeof item === 'object') {
    // if it is a translated field, then return the language or default
    if (item[defaultLanguage]) return item[language] ?? item[defaultLanguage];
    // else iterate object properties
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        pickLanguageRecursive({ item: value, language }),
      ]),
    );
  }
  // if not array or object, then just return the value
  return item;
};

export default ContentAPI;
