import React from 'react';
import { config } from '../config';
import { useI18n } from '../i18n';

export function LanguageSelector() {
  const { locale, changeLocale } = useI18n();

  return (
    <select onChange={(e) => changeLocale(e.target.value)} value={locale.code}>
      {config.LANGUAGES.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
