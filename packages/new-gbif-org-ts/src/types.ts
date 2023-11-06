import { RouteObject } from "react-router-dom";
import { Config } from "./config";

export type LoaderArgs = {
    request: Request;
    config: Config;
    locale: Config['languages'][number];
    params: Record<string, string | undefined>;
}