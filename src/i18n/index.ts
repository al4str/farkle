import type { I18nLanguage } from "src/i18n/language";
import { i18nDetectLanguage, i18nStoreLanguage } from "src/i18n/language";
import { i18nLoadLanguage } from "src/i18n/translation";

export function i18nSetLanguage(language: I18nLanguage): void {
  i18nStoreLanguage(language);
  void i18nLoadLanguage(language);
}

export function i18nInitialize(): void {
  i18nSetLanguage(i18nDetectLanguage());
}
