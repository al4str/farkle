import { i18nTranslate } from "src/i18n/translation";

export function errorMessageToString(error: unknown): string {
  if (error instanceof Error) {
    return trimMessage(error.name.concat(": ").concat(error.message));
  }
  if (error && typeof error === "string") {
    return trimMessage(error);
  }
  if (error && typeof error === "object" && "toString" in error && typeof error.toString === "function") {
    /** Intentional usage */
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const message = error.toString();
    if (typeof message === "string") {
      return trimMessage(message);
    }
  }
  return i18nTranslate("common.status.unknown_error");
}

const MAX_LENGTH = 100;

function trimMessage(message: string): string {
  return message.length > MAX_LENGTH
    ? message.slice(0, 100 - 3).concat("...")
    : message;
}
