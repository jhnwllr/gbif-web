import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { NavLink, useNavigation } from 'react-router-dom';
import { LocalizedLink } from './LocalizedLink';

type Props = {
  children: React.ReactNode;
};

export function GbifRootLayout({ children }: Props) {
  const navigation = useNavigation();

  return (
    <>
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
      <main>{children}</main>
    </>
  );
}
