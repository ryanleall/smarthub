import { OnErrorFn } from '@formatjs/intl';
import { Locale as DateFnsLocale } from 'date-fns';
import preferredLocale from 'preferred-locale';
import React, { useReducer } from 'react';
import { IntlProvider } from 'react-intl';
import { useAsync, useCookie, useEvent } from 'react-use';

import translations from 'app/locales';

type LocaleState = {
  locale: string;
  setLocale: (locale: string) => void;
  unsetLocale: () => void;
};

function useLocaleState(locale?: string): LocaleState {
  const [cookie, setCookie, unsetCookie] = useCookie('chosenLocale');
  const availableLocales = Object.keys(translations);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (locale) {
    return { locale, setLocale: setCookie, unsetLocale: unsetCookie };
  } else if (cookie) {
    // Listen for language change
    useEvent('languagechange', forceUpdate, window);

    // If the user has chosen an invalid locale, delete it
    if (cookie && availableLocales.indexOf(cookie) === -1) {
      unsetCookie();
    }

    return { locale: cookie, setLocale: setCookie, unsetLocale: unsetCookie };
  } else {
    const availableLocales = Object.keys(translations);
    return {
      locale: preferredLocale(availableLocales, 'en'),
      setLocale: setCookie,
      unsetLocale: unsetCookie,
    };
  }
}

export const LocaleContext = React.createContext<{
  locale: string;
  setLocale: (locale: string) => void;
  unsetLocale: () => void;
}>({
  locale: 'en',
  setLocale: () => null,
  unsetLocale: () => null,
});

// @ts-ignore We guarantee that this is actually never null
export const DateFnsLocaleContext = React.createContext<DateFnsLocale>(null);

const IntlContext: React.FC<{ locale?: string }> = function ({
  children,
  locale,
}) {
  const value = useLocaleState(locale);
  const { value: localeData } = useAsync(translations[value.locale].load);

  const onError: OnErrorFn | undefined = import.meta.env.DEV
    ? (err) => {
        if (err.code === 'MISSING_TRANSLATION') return;
        throw err;
      }
    : undefined;

  return localeData ? (
    <LocaleContext.Provider value={value}>
      <DateFnsLocaleContext.Provider value={localeData.dateFns}>
        <IntlProvider
          onError={onError}
          locale={value.locale}
          messages={localeData.kitsu}
          key={value.locale}
          defaultRichTextElements={{
            b: (children) => <b>{children}</b>,
          }}
        >
          {children}
        </IntlProvider>
      </DateFnsLocaleContext.Provider>
    </LocaleContext.Provider>
  ) : null;
};

export default IntlContext;

export function useLocale(): LocaleState {
  return React.useContext(LocaleContext);
}

export function useDateFnsLocale(): DateFnsLocale {
  return React.useContext(DateFnsLocaleContext);
}
