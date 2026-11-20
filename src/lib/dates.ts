/** Normalize DB / ISO values for `<input type="date">` (requires YYYY-MM-DD). */
export function toDateInputValue(value: unknown): string {
  if (value == null || value === "") return "";
  const s = String(value).trim();
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  return "";
}