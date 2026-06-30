import { IntlMessageFormat } from "intl-messageformat";
import { createStore } from "solid-js/store";

import type { I18nKey, I18nParams, I18nTranslationRecord } from "src/i18n/types";
import type { I18nLanguage } from "src/i18n/language";
import { I18N_DEFAULT_LANGUAGE, i18nGetLanguage } from "src/i18n/language";
import en from "src/i18n/translations/en.json";

const [translations, translationsSet] = createStore<Record<I18nLanguage, I18nTranslationRecord>>({
  en,
  cs: en,
  ru: en,
  mp: en,
});

const FORMAT_CACHE = new Map<string, IntlMessageFormat>();

export async function i18nLoadLanguage(language: I18nLanguage): Promise<void> {
  if (language === "en") {
    return;
  }
  if (translations[language] !== en) {
    return;
  }
  switch (language) {
    case "cs":
    case "ru":
    case "mp":
    default: {
      const module = await import("src/i18n/translations/en.json");
      translationsSet("en", isJsonTranslationRecord(module.default) ? module.default : en);
    }
  }
}

export function i18nTranslate(key: I18nKey, params?: I18nParams): string {
  const currentLanguage = i18nGetLanguage();
  let value = translations[currentLanguage][key];
  if (!value) {
    console.warn(`Translation key not found: ${key} for language: ${currentLanguage}`);
    value = translations[I18N_DEFAULT_LANGUAGE][key];
  }
  if (typeof value === "string") {
    if (params) {
      const locale = currentLanguage === "mp" ? "en" : currentLanguage;
      const cacheKey = `${locale}:${value}`;
      let formatter = FORMAT_CACHE.get(cacheKey);
      if (!formatter) {
        formatter = new IntlMessageFormat(value, locale);
        FORMAT_CACHE.set(cacheKey, formatter);
      }
      const cleanParams: Record<string, string | number> = {};
      for (const [paramKey, paramValue] of Object.entries(params)) {
        if (paramValue != null) {
          cleanParams[paramKey] = paramValue;
        }
      }
      const formatted = formatter.format(cleanParams);
      return typeof formatted === "string" ? formatted : value;
    }
    return value;
  }
  return key;
}

function isJsonTranslationRecord(value: unknown): value is I18nTranslationRecord {
  return value !== null && typeof value === "object" && Object.keys(en).some((key) => key in value);
}
