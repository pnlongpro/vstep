'use server';

import { cookies } from 'next/headers';
import { locales, defaultLocale, Locale } from '@/i18n';

export async function setLocale(locale: string) {
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;
  const cookieStore = await cookies();
  
  cookieStore.set('NEXT_LOCALE', validLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
}

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}
