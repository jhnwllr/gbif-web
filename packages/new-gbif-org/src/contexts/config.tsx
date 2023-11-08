import React from 'react';

export type Config = {
  defaultTitle?: string;
  graphqlEndpoint: string;
  languages: {
    code: string;
    label: string;
    default: boolean;
    textDirection: 'ltr' | 'rtl';
  }[];
  occurrencePredicate: any;
};

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: Config;
};

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig(): Config {
  const ctx = React.useContext(ConfigContext);

  if (ctx == null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return ctx;
}
