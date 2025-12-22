// Utilities for converting and formatting verse number data

export function parseVerseString(raw: string | number | undefined): number[] {
  if (raw == null) return [];
  const s = String(raw).trim();
  if (s.includes('-')) {
    const [a, b] = s.split('-').map((p) => parseInt(p.trim(), 10));
    if (!Number.isNaN(a) && !Number.isNaN(b) && b >= a) {
      const out: number[] = [];
      for (let i = a; i <= b; i++) out.push(i);
      return out;
    }
    return [];
  }
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? [] : [n];
}

export default { parseVerseString };
