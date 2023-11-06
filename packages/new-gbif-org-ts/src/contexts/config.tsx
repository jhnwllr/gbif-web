import React from "react";
import { z } from "zod";

const ConfigSchema = z.object({
  defaultTitle: z.string().optional(),
  graphqlEndpoint: z.string(),
  languages: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      default: z.boolean(),
      textDirection: z.union([z.literal("ltr"), z.literal("rtl")]),
    })
  ),
  //? Does it add value to type this? 
  occurrencePredicate: z.any(),
});

export type Config = z.infer<typeof ConfigSchema>;

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: Config;
};

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): Config {
  const ctx = React.useContext(ConfigContext);

  if (ctx == null) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return ctx;
}
