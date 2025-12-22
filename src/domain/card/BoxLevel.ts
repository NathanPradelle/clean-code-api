export type BoxLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const BOX_LEVELS: BoxLevel[] = [1, 2, 3, 4, 5, 6, 7];

export function isBoxLevel(value: number): value is BoxLevel {
  return BOX_LEVELS.includes(value as BoxLevel);
}
