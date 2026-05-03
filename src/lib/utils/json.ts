/**
 * Safely parse a JSON string, returning a fallback value if parsing fails.
 * @param str - The JSON string to parse
 * @param fallback - The fallback value if parsing fails
 * @returns The parsed value or fallback
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify a value to JSON, returning a fallback string if serialization fails.
 * @param value - The value to stringify
 * @param fallback - The fallback string if serialization fails
 * @returns The JSON string or fallback
 */
export function safeJsonStringify(value: unknown, fallback: string = '[]'): string {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}
