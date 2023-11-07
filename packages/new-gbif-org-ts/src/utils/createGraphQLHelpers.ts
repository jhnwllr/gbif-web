import { useLoaderData } from 'react-router-dom';
import request from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export function createGraphQLHelpers<TResult, TVariabels>(
  document: TypedDocumentNode<TResult, TVariabels>
) {
  const useTypedLoaderData = useLoaderData as () => TResult;

  function query(options: { url: string; request: Request; variables: TVariabels }) {
    return request({
      url: options.url,
      signal: options.request.signal,
      variables: options.variables as any,
      document,
    });
  }

  return {
    query,
    useTypedLoaderData,
  };
}
