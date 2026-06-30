import en from "src/i18n/translations/en.json";

export type I18nKey = keyof typeof en;

export type I18nTranslationRecord = Record<I18nKey, string>;

export type I18nParams = Record<string, undefined | null | string | number>;
