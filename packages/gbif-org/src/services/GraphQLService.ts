import hash from 'object-hash';
import { fragmentManager } from './_FragmentManager';

const MAX_GET_LENGTH = 1000;

type DataProviderOptions = {
  endpoint: string;
  locale: string;
  abortSignal: AbortSignal;
};

export class GraphQLService {
  private endpoint: string;
  private locale: string;
  private abortSignal: AbortSignal;

  constructor(options: DataProviderOptions) {
    this.endpoint = options.endpoint;
    this.locale = options.locale;
    this.abortSignal = options.abortSignal;
  }

  public async query<TResult, TVariabels>(
    query: string,
    variables: TVariabels
  ): Promise<Omit<Response, 'json'> & { json(): Promise<TResult> }> {
    // Add fragments to the query
    const queryWithFragments = fragmentManager.addFragmentsToQuery(query);

    // Create a query string for the GET request based on a hased version of the query and variables
    const queryString = this.createQueryStringForGetRequest(
      queryWithFragments,
      variables,
      this.locale
    );

    return fetch(`${this.endpoint}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        locale: this.locale,
      },
      signal: this.abortSignal,
    }).then(async (getResponse) => {
      const body = await getResponse.json();

      // If the server responded does not respond with unknownQueryId: true or unknownVariablesId: true, we can safely return the response
      if (body.unknownQueryId !== true && body.unknownVariablesId !== true) {
        // The json method can not be called twice on the same response object as the body stream is already consumed.
        // To prevent this error we override the json method to return the body object that has allready been parsed.
        // This is a bit of a hack, but it is more performant than calling response.clone() and then calling response.json() on the clone.
        getResponse.json = async () => body;

        return getResponse;
      }

      // Otherwise, we need to do a POST request to the GraphQL endpoint
      const operationName = this.getOperationNameFromQuery(queryWithFragments);
      if (typeof operationName !== 'string') {
        throw new Error(`Could not find operation name in query: ${queryWithFragments}`);
      }

      return fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          locale: this.locale,
        },
        signal: this.abortSignal,
        body: JSON.stringify({
          query: queryWithFragments,
          variables: variables,
          operationName,
        }),
      });
    });
  }

  private getOperationNameFromQuery(query: string): string | null {
    // This regex looks for the operation name pattern in the GraphQL query string.
    // It finds the word immediately following the 'query' keyword.
    const operationNameMatch = /^\s*query\s+(\w+)/.exec(query);
    // If a match is found, return the first group (the operation name).
    // Otherwise, return null.
    return operationNameMatch ? operationNameMatch[1] : null;
  }

  private createQueryStringForGetRequest(query: string, variables: unknown, locale: string) {
    const queryId = hash(query);

    const queryParams: Record<string, string> = {
      strict: 'true',
      queryId,
      // This is to prevent caching across locales
      locale,
    };

    const variablesTooLongForGET =
      variables && encodeURIComponent(JSON.stringify(variables)).length > MAX_GET_LENGTH;
    // this is a bit silly. why serialize and then hash the object. would be cheaper to simply hash the serialized
    if (variablesTooLongForGET) {
      queryParams.variablesId = hash(JSON.parse(JSON.stringify(variables))); // it feels insane having to stringify and then parse again, but the  hash function cannot handle when multiple parts ot object reference the same object. E.g. no reuse. See https://github.com/puleos/object-hash/issues/78
    } else {
      queryParams.variables = JSON.stringify(variables);
    }

    return new URLSearchParams(queryParams).toString();
  }
}
