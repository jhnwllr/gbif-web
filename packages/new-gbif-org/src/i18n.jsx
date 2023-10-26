import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDefaultLocale } from './hooks/useDefaultLocale';

const I18nContext = React.createContext({
  locale: undefined,
  changeLocale: () => {
    throw new Error(
      'changeLocale() has not been implemented. This happens when you use useI18n() outside of an I18nProvider.'
    );
  },
});

export function I18nProvider({ locale, children }) {
  const navigate = useNavigate();
  const defaultLocale = useDefaultLocale();

  // This function will only work client side as it uses window.location
  // If it needs to work server side, you can use the location from useLocation. This will however rerender the children of this component every time the location changes.
  const context = React.useMemo(() => {
    return {
      locale,
      changeLocale: (targetLocaleCode) => {
        if (locale.code === targetLocaleCode) return;

        const currentLocaleIsDefault = defaultLocale.code === locale.code;
        const currentPrefix = currentLocaleIsDefault ? '/' : `/${locale.code}/`;

        const targetLocaleIsDefault = defaultLocale.code === targetLocaleCode;
        const targetPrefix = targetLocaleIsDefault ? '/' : `/${targetLocaleCode}/`;

        const newPathname = window.location.pathname.replace(currentPrefix, targetPrefix);
        const target = `${newPathname}${window.location.search}`;

        navigate(target);
      },
    };
  }, [locale, navigate, defaultLocale]);

  return <I18nContext.Provider value={context}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}
