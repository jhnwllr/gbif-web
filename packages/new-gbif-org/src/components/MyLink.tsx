import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/i18n';
import { useDefaultLocale } from '@/hooks/useDefaultLocale';
import { useExternalGbifLink } from '@/contexts/metadataRoutes';

type Props = {
  to: string;
  as?: React.ElementType;
  children?: React.ReactNode;
};

export function MyLink(props: Props): React.ReactElement {
  const { locale } = useI18n();
  const defaultLocale = useDefaultLocale();

  // Create localized Link
  const isDefaultLocale = defaultLocale.code === locale.code;
  const isAbsoluteLink = props.to.startsWith('/');
  const to = isAbsoluteLink && !isDefaultLocale ? `/${locale.code}${props.to}` : props.to;

  // Should this link redirect to gbif.org?
  const gbifLink = useExternalGbifLink(to);
  if (gbifLink) {
    return <a href={gbifLink}>{props.children}</a>;
  }

  const LinkComponent = props.as ?? Link;
  return <LinkComponent {...props} to={to} />;
}
