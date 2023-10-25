import React from 'react';
import { Helmet } from 'react-helmet-async';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not found</title>
      </Helmet>

      <p>Page not found</p>
    </>
  );
}
