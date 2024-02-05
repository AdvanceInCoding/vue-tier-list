export interface DraggableItem {
  title: string;
  img: string;
}

export type DraggableItems = DraggableItem[];

export const defaultTierList = [
  'SS',
  'S',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
] as const;

export declare namespace TierList {
  export type Tier = (typeof defaultTierList)[number];

  export interface Item {
    img: string;
  }

  export interface Row {
    tier: Tier;
    items: Item[];
  }
}

