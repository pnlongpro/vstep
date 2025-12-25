import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['vi', 'en'] as const;
export const defaultLocale = 'vi' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = locales.includes(localeCookie as Locale) ? localeCookie : defaultLocale;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
