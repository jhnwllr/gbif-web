import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from './routes';

const { query, dataRoutes } = createStaticHandler(routes);

export async function render(req) {
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  // The context can be a Response object if any of the matched routes return or throw a redirect response
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  // Used to capture the head contents
  const helmetContext = {};

  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
      </HelmetProvider>
    </React.StrictMode>
  );

  const headHtml = createHeadHtml(helmetContext.helmet);

  return {
    appHtml,
    headHtml,
    htmlAttributes: helmetContext.helmet.htmlAttributes.toString(),
    bodyAttributes: helmetContext.helmet.bodyAttributes.toString(),
  };
}

function createHeadHtml(helmet) {
  return [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join('\n');
}

function createFetchRequest(req) {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
