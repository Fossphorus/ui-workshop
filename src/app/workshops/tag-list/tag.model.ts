export type TagColorName =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'black'
  | 'darkGrey'
  | 'lightGrey'
  | 'white';

export interface TagColor {
  name: TagColorName;
  label: string;
  value: string;
  text: 'dark' | 'light';
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: TagColorName;
}

export interface ManagedObject {
  id: string;
  name: string;
  tagIds: string[];
}

export type TagSortMode = 'name' | 'color';

export type TagScenarioId =
  | 'empty'
  | 'few'
  | 'manyWrapping'
  | 'longNames'
  | 'allAttached'
  | 'manyGlobal'
  | 'loading'
  | 'createError'
  | 'attachError'
  | 'detachError';

export interface TagScenario {
  id: TagScenarioId;
  label: string;
  description: string;
}

export const TAG_COLORS: TagColor[] = [
  { name: 'red', label: 'Red', value: '#dc2626', text: 'light', order: 10 },
  { name: 'orange', label: 'Orange', value: '#f97316', text: 'dark', order: 20 },
  { name: 'yellow', label: 'Yellow', value: '#facc15', text: 'dark', order: 30 },
  { name: 'green', label: 'Green', value: '#16a34a', text: 'light', order: 40 },
  { name: 'blue', label: 'Blue', value: '#2563eb', text: 'light', order: 50 },
  { name: 'purple', label: 'Purple', value: '#7c3aed', text: 'light', order: 60 },
  { name: 'pink', label: 'Pink', value: '#ec4899', text: 'light', order: 70 },
  { name: 'brown', label: 'Brown', value: '#8b5e34', text: 'light', order: 80 },
  { name: 'black', label: 'Black', value: '#111827', text: 'light', order: 90 },
  { name: 'darkGrey', label: 'Dark grey', value: '#4b5563', text: 'light', order: 100 },
  { name: 'lightGrey', label: 'Light grey', value: '#e5e7eb', text: 'dark', order: 110 },
  { name: 'white', label: 'White', value: '#ffffff', text: 'dark', order: 120 }
];

export function getTagColor(colorName: TagColorName): TagColor {
  return TAG_COLORS.find((color) => color.name === colorName) ?? TAG_COLORS[0];
}

export function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}
