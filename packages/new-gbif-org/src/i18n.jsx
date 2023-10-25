import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { config } from './config';

const defaultLocale = config.LANGUAGES.find((l) => l.default);

const I18nContext = React.createContext({
  locale: undefined,
});

function I18nProvider({ locale }) {
  return (
    <I18nContext.Provider value={{ locale }}>
      <Outlet />
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const { locale } = React.useContext(I18nContext);
  const navigate = useNavigate();
  const location = useLocation();

  return {
    locale,
    changeLocale: (targetLocaleCode) => {
      if (locale.code === targetLocaleCode) return;

      const currentLocaleIsDefault = defaultLocale.code === locale.code;
      const currentPrefix = currentLocaleIsDefault ? '/' : `/${locale.code}/`;

      const targetLocaleIsDefault = defaultLocale.code === targetLocaleCode;
      const targetPrefix = targetLocaleIsDefault ? '/' : `/${targetLocaleCode}/`;

      const newPathname = location.pathname.replace(currentPrefix, targetPrefix);
      const target = `${newPathname}${location.search}`;

      navigate(target);
    },
  };
}

export function localizeRoutes(routes) {
  return config.LANGUAGES.map((locale) => ({
    path: locale.default ? '/' : locale.code,
    element: <I18nProvider locale={locale} />,
    children: routes,
  }));
}

export function LocalizedLink(props) {
  const { locale } = useI18n();

  // Create localized Link
  const isDefaultLocale = defaultLocale.code === locale.code;
  const isAbsoluteLink = props.to.startsWith('/');
  const to = isAbsoluteLink && !isDefaultLocale ? `/${locale.code}${props.to}` : props.to;

  const LinkComponent = props.as ?? Link;
  return <LinkComponent {...props} to={to} />;
}
