import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { NavLink, Outlet, useNavigation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LocalizedLink, useI18n } from '../i18n';

export function RootLayout() {
  const navigation = useNavigation();
  const { locale } = useI18n();

  return (
    <>
      <Helmet>
        <html lang={locale.code} dir={locale.textDirection} />
        <title>GBIF</title>
      </Helmet>

      {navigation.state === 'loading' && <p>Loading...</p>}
      <header style={{ display: 'flex', gap: '10px' }}>
        <LanguageSelector />
        <nav style={{ display: 'flex', gap: '10px' }}>
          <LocalizedLink as={NavLink} to="/">
            Home
          </LocalizedLink>
          <LocalizedLink as={NavLink} to="/occurrence/search">
            Search
          </LocalizedLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
