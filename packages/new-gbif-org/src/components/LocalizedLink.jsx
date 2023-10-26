import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useDefaultLocale } from '../hooks/useDefaultLocale';

export function LocalizedLink(props) {
  const { locale } = useI18n();
  const defaultLocale = useDefaultLocale();

  // Create localized Link
  const isDefaultLocale = defaultLocale.code === locale.code;
  const isAbsoluteLink = props.to.startsWith('/');
  const to = isAbsoluteLink && !isDefaultLocale ? `/${locale.code}${props.to}` : props.to;

  const LinkComponent = props.as ?? Link;
  return <LinkComponent {...props} to={to} />;
}
