import { RouteObject } from "react-router-dom";
import { Config } from "./contexts/config";

export type LoaderArgs = {
    request: Request;
    config: Config;
    locale: Config['languages'][number];
    params: Record<string, string | undefined>;
}

export type MyRouteObject = Omit<RouteObject, 'loader' | 'children'> & {
    loader?: (args: LoaderArgs) => Promise<any>;
    children?: MyRouteObject[];
  }
  
  