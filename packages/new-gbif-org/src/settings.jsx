import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsContext = React.createContext({
  graphqlEndpoint: undefined,
  languages: [],
  occurrencePredicate: {},
});

export function SettingsProvider({ settings }) {
  return (
    <SettingsContext.Provider value={settings}>
      <Outlet />
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return React.useContext(SettingsContext);
}
