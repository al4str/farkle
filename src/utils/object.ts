/**
 * Typed `Object.keys`. The built-in widens the result to `string[]`, discarding
 * the literal key union; for records with a known key type this preserves it.
 */
export function objectKeys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

/**
 * Typed `Object.entries`. The built-in widens keys to `string`; this preserves
 * the literal `keyof T` union for records with known keys.
 */
export function objectEntries<T extends object>(object: T): [keyof T, T[keyof T]][] {
  return Object.entries(object) as [keyof T, T[keyof T]][];
}

/**
 * Typed `Object.fromEntries`. The built-in returns `Record<string, V>`,
 * discarding the literal key union; this preserves `Record<K, V>` for entries
 * with a known key type.
 */
export function objectFromEntries<K extends PropertyKey, V>(entries: readonly (readonly [K, V])[]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
