import type { AudioSoundDef } from "src/audio/types";

export const AUDIO_CATALOG = {
  coins_to_total: {
    bus: "sfx",
    variants: [
      "coin_multiple_table_shift_06",
      "coin_multiple_table_shift_07",
    ],
  },
  coins_to_turn: {
    bus: "sfx",
    variants: [
      "coins_out_01",
    ],
  },
  coins_next_turn: {
    bus: "sfx",
    variants: [
      "coin_table_roll_03",
    ],
  },
  coins_farkled: {
    bus: "sfx",
    variants: [
      "coins_to_ground_03",
    ],
  },
  cup_put: {
    bus: "sfx",
    variants: [
      "cup_put_empty_005",
    ],
  },
  cup_take: {
    bus: "sfx",
    variants: [
      "cup_take_005",
    ],
  },
  cup_shake_single: {
    bus: "sfx",
    variants: [
      "die_cup_shake2_06",
      "die_cup_shake2_08",
    ],
  },
  cup_shake_multiple: {
    bus: "sfx",
    variants: [
      "dice_cup_shake_010",
      "dice_cup_shake_012",
    ],
  },
  dice_take_1: {
    bus: "sfx",
    variants: [
      "1die_take_01",
      "1die_take_03",
    ],
  },
  dice_take_2: {
    bus: "sfx",
    variants: [
      "2dice_take_01",
      "2dice_take_04",
    ],
  },
  dice_take_5: {
    bus: "sfx",
    variants: [
      "5dice_take_02",
      "5dice_take_05",
    ],
  },
  dice_put_2: {
    bus: "sfx",
    variants: [
      "2dice_put_04",
    ],
  },
  dice_put_4: {
    bus: "sfx",
    variants: [
      "4dice_put_09",
    ],
  },
  dice_put_6: {
    bus: "sfx",
    variants: [
      "6dice_put_05",
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
  dice_to_table_single: {
    bus: "sfx",
    variants: [
      "die_to_table_005",
      "die_to_table_008",
      "die_to_table_009",
      "die_to_table_010",
    ],
  },
  dice_to_table_multiple: {
    bus: "sfx",
    variants: [
      "dice_to_table_004",
      "dice_to_table_005",
      "dice_to_table_006",
      "dice_to_table_007",
    ],
  },
  dice_select: {
    bus: "sfx",
    variants: [
      "dice_ui_select_PLACEHOLDER_03",
    ],
  },
  cling_low: {
    bus: "ui",
    variants: [
      "ui_cling_19",
      "ui_cling_20",
      "ui_cling_49",
    ],
    preload: true,
  },
  cling_mid: {
    bus: "ui",
    variants: [
      "ui_cling_12",
      "ui_cling_15",
      "ui_cling_17",
    ],
    preload: true,
  },
  cling_high: {
    bus: "ui",
    variants: [
      "ui_cling_52",
      "ui_cling_53",
    ],
    preload: true,
  },
  cling_tambourine: {
    bus: "ui",
    variants: [
      "ui_tambourine1_01",
    ],
    preload: true,
  },
  cling_whoosh_short: {
    bus: "ui",
    variants: [
      "ui_whoosh_04",
      "ui_whoosh_11",
      "ui_whoosh_12",
    ],
  },
  cling_whoosh_mid: {
    bus: "ui",
    variants: [
      "ui_whoosh_13",
      "ui_whoosh_14_2",
      "ui_whoosh_14_5",
    ],
    preload: true,
  },
  cling_whoosh_long: {
    bus: "ui",
    variants: [
      "ui_whoosh_05_sh",
      "ui_whoosh_06",
      "ui_whoosh_07",
      "ui_whoosh_08",
    ],
  },
  cling_clack: {
    bus: "ui",
    variants: [
      "ui_wood_clack_01",
    ],
    preload: true,
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
