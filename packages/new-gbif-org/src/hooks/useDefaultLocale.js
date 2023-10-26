import { useConfig } from '../config';

export function useDefaultLocale() {
  const { languages } = useConfig();
  return languages.find((l) => l.default);
}
