import React from 'react';
import { useConfig } from '../config';
import { useI18n } from '../i18n';

export function LanguageSelector() {
  const { locale, changeLocale } = useI18n();
  const { languages } = useConfig();

  return (
    <select onChange={(e) => changeLocale(e.target.value)} value={locale.code}>
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
