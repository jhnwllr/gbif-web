import React from 'react';

const ConfigContext = React.createContext({
  graphqlEndpoint: undefined,
  languages: [],
  occurrencePredicate: {},
});

export function ConfigProvider({ config, children }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return React.useContext(ConfigContext);
}
