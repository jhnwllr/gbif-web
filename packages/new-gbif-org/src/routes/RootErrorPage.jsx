import React from 'react';
import { useRouteError } from 'react-router-dom';

export function RootErrorPage() {
  const error = useRouteError();

  console.error(error);

  return (
    <>
      <h1>Oops an error occurred!</h1>
      <p>{error.message}</p>
    </>
  );
}
