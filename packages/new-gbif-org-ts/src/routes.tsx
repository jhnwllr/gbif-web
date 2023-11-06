import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from "./routes/occurrence/search/OccurrenceSearchPage";
import {
  DetailedOccurrencePage,
  loader as detailedOccurrenceLoader,
} from "./routes/occurrence/key/DetailedOccurrencePage";
import { NotFound } from "./routes/NotFound";
import { I18nProvider } from "./i18n";
import { RootErrorPage } from "./routes/RootErrorPage";
import { Outlet, RouteObject } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Config } from "./config";
import { HomePage } from "./routes/HomePage";
import { LoaderArgs } from "./types";

type MyRouteObject = Omit<RouteObject, 'loader' | 'children'> & {
  loader?: (args: LoaderArgs) => Promise<any>;
  children?: MyRouteObject[];
}

const baseRoutes: MyRouteObject[] = [
  {
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "occurrence/search",
        loader: occurrenceSearchLoader,
        element: <OccurrenceSearchPage />,
      },
      {
        path: "occurrence/:key",
        loader: detailedOccurrenceLoader,
        element: <DetailedOccurrencePage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

// This function will change the base routes based on the provided config
// It will do the following:
// - Wrap the routes with a root layout if provided in the config.
// - Duplicate the routes for each language with a specific path prefix.
// - Wrap root routes with the I18nProvider making the locale available to the route and its children.
// - Inject the config into the loaders
// - Inject the selected locale into the loaders
export function createRoutes(config: Config): RouteObject[] {
  let resultRoutes = baseRoutes;

  // // Wrap the routes with a root layout if provided in the config
  // if (typeof config.rootLayout === 'function') {
  //   const RootLayout = config.rootLayout;
  //   resultRoutes = [
  //     {
  //       element: <RootLayout children={<Outlet />} />,
  //       children: routes,
  //     },
  //   ];
  // }

  return config.languages.map((locale) => ({
    path: locale.default ? "/" : locale.code,
    element: (
      <I18nProvider locale={locale}>
        <Helmet>
          <html lang={locale.code} dir={locale.textDirection} />
        </Helmet>

        <Outlet />
      </I18nProvider>
    ),
    children: recursivelyTransformRoutes(resultRoutes, config, locale),
  }));
}

function recursivelyTransformRoutes(
  routes: MyRouteObject[],
  config: Config,
  locale: Config["languages"][number]
): RouteObject[] {
  return routes.map((route) => {
    const clone = { ...route } as RouteObject;

    // Inject the config and locale into the loader
    const loader = route.loader;
    if (typeof loader === "function") {
      clone.loader = (args: any) => loader({ ...args, config, locale });
    }

    // Recurse into children
    if (Array.isArray(route.children)) {
      clone.children = recursivelyTransformRoutes(
        route.children,
        config,
        locale
      );
    }

    return clone;
  });
}
