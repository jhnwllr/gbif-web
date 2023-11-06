import { Outlet, RouteObject } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Config } from '../contexts/config';
import { MyRouteObject } from '../types';
import { I18nProvider } from '../contexts/i18n';

// This function will change the base routes based on the provided config
// It will do the following:
// - Duplicate the routes for each language with a specific path prefix.
// - Wrap root routes with the I18nProvider making the locale available to the route and its children.
// - Inject the config and selected locale into the loaders
export function configureRoutes(baseRoutes: MyRouteObject[], config: Config): RouteObject[] {
  return config.languages.map((locale) => ({
    path: locale.default ? '/' : locale.code,
    element: (
      <I18nProvider locale={locale}>
        <Helmet>
          <html lang={locale.code} dir={locale.textDirection} />
        </Helmet>

        <Outlet />
      </I18nProvider>
    ),
    children: recursivelyTransformRoutes(baseRoutes, config, locale),
  }));
}

function recursivelyTransformRoutes(
  routes: MyRouteObject[],
  config: Config,
  locale: Config['languages'][number]
): RouteObject[] {
  return routes.map((route) => {
    const clone = { ...route } as RouteObject;

    // Inject the config and locale into the loader
    const loader = route.loader;
    if (typeof loader === 'function') {
      clone.loader = (args: any) => loader({ ...args, config, locale });
    }

    // Recurse into children
    if (Array.isArray(route.children)) {
      clone.children = recursivelyTransformRoutes(route.children, config, locale);
    }

    return clone;
  });
}
