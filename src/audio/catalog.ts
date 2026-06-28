import type { AudioSoundDef } from "src/audio/types";

export const AUDIO_CATALOG = {
  ui_click: {
    bus: "ui",
    variants: [
      "1die_take_01",
    ],
    volume: 0.8,
    preload: true,
  },
  ui_select: {
    bus: "ui",
    variants: [
      "1die_take_03",
    ],
    volume: 0.8,
    preload: true,
  },
  dice_hit: {
    bus: "sfx",
    variants: [
      "dicehit_wood1",
      "dicehit_wood2",
      "dicehit_wood3",
      "dicehit_wood4",
      "dicehit_wood5",
      "dicehit_wood6",
      "dicehit_wood7",
      "dicehit_wood8",
      "dicehit_wood9",
      "dicehit_wood10",
      "dicehit_wood11",
      "dicehit_wood12",
    ],
    maxVoices: 6,
  },
  table_surface: {
    bus: "sfx",
    variants: [
      "surface_wood_table1",
      "surface_wood_table2",
      "surface_wood_table3",
      "surface_wood_table4",
      "surface_wood_table5",
      "surface_wood_table6",
      "surface_wood_table7",
    ],
  },
  dice_to_table: {
    bus: "sfx",
    variants: [
      "dice_to_table_004",
      "dice_to_table_005",
      "dice_to_table_006",
      "dice_to_table_007",
    ],
  },
  die_to_table: {
    bus: "sfx",
    variants: [
      "die_to_table_005",
      "die_to_table_008",
      "die_to_table_009",
      "die_to_table_010",
    ],
  },
  dice_to_cup: {
    bus: "sfx",
    variants: [
      "dice_to_cup_001",
      "dice_to_cup_003",
      "dice_to_cup_006",
    ],
  },
  cup_shake: {
    bus: "sfx",
    variants: [
      "die_cup_shake2_06",
      "die_cup_shake2_08",
    ],
  },
  dice_take: {
    bus: "sfx",
    variants: [
      "1die_take_01",
      "1die_take_03",
      "2dice_take_01",
      "2dice_take_04",
      "5dice_take_02",
      "5dice_take_05",
    ],
  },
  dice_put: {
    bus: "sfx",
    variants: [
      "2dice_put_04",
      "4dice_put_09",
      "6dice_put_05",
    ],
  },
} satisfies Record<string, AudioSoundDef>;

export type AudioSoundId = keyof typeof AUDIO_CATALOG;

export function audioCatalogGet(id: AudioSoundId): AudioSoundDef {
  return AUDIO_CATALOG[id];
}

export function audioCatalogIds(): readonly AudioSoundId[] {
  return objectKeys(AUDIO_CATALOG);
}

function objectKeys<T extends object>(value: T): (keyof T)[] {
  return Object.keys(value) as (keyof T)[];
}
