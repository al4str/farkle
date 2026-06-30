import type { SetStoreFunction } from "solid-js/store";
import { createStore } from "solid-js/store";

export type I18nLanguage = keyof typeof I18N_LANGUAGE_LABELS;

export const I18N_DEFAULT_LANGUAGE = "en" as const;

export const I18N_LANGUAGE_LABELS = {
  en: "English",
  cs: "Čeština",
  ru: "Русский",
  mp: "Monty Python",
} as const;

const STORAGE_KEY = "farkle.language";

interface State {
  language: I18nLanguage;
}

type Store = [
  state: State,
  setState: SetStoreFunction<State>,
];

export const [i18nState, i18nStateSet] = loadStore();

export function i18nIsLanguageSupported(language?: null | string): language is I18nLanguage {
  if (typeof language === "string") {
    return language in I18N_LANGUAGE_LABELS;
  }
  return false;
}

export function i18nGetLanguage(): I18nLanguage {
  return i18nState.language;
}

export function i18nDetectLanguage(): I18nLanguage {
  const stored = readStoredLanguage();
  if (i18nIsLanguageSupported(stored)) {
    return stored;
  }
  const [browserLanguage] = window.navigator.language.split("-");
  if (i18nIsLanguageSupported(browserLanguage)) {
    return browserLanguage;
  }
  return I18N_DEFAULT_LANGUAGE;
}

export function i18nStoreLanguage(language: I18nLanguage): void {
  i18nStateSet("language", language);
  window.document.documentElement.lang = language === "mp" ? "en" : language;
  persistLanguage(language);
}

function loadStore(): Store {
  const data = import.meta.hot?.data;
  if (data && isStore(data.store)) {
    return data.store;
  }
  const created = createStore<State>({ language: I18N_DEFAULT_LANGUAGE });
  if (data) {
    data.store = created;
  }
  return created;
}

function readStoredLanguage(): null | string {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  }
  catch {
    return null;
  }
}

function persistLanguage(language: I18nLanguage): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  }
  catch {
    // localStorage may be unavailable or full; persistence is best-effort.
  }
}

function isStore(value: unknown): value is Store {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === "object" && value[0] !== null && typeof value[1] === "function";
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
