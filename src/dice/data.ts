import * as z from "zod";

import { objectFromEntries } from "src/utils/object";
import { DICE_ID_SCHEMA, diceGenerateId } from "src/dice/ids";

import DICE_CATALOG from "src/dice/catalog.json";

export type DiceMetaData = (typeof DICE_CATALOG)[number];

export type DiceWeights = z.infer<typeof DICE_WEIGHTS_SCHEMA>;

export type DiceName = z.infer<typeof DICE_NAME_SCHEMA>;

export type DiceValue = z.infer<typeof DICE_VALUE_SCHEMA>;

export type DiceItem = z.infer<typeof DICE_ITEM_SCHEMA>;

export type DiceSet = Set<DiceItem>;

export interface DiceData {
  name: DiceName;
  id: string;
  title: string;
  description: string;
  weights: DiceWeights;
  isDevil?: boolean;
}

const DICE_AMOUNT = 6;

const DICE_WEIGHTS_SCHEMA = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]).readonly();

export const DICE_NAME_SCHEMA = z.enum([
  "dieUnbalanced",
  "die_Matematikova",
  "dieSkull",
  "dieLucky",
  "die_Vozkova",
  "zachranaPtacka_die_sad_sergeant",
  "die_Gamblerova_good",
  "die_Antiocha",
  "dieEven",
  "dieTeeth_c",
  "dieStripping",
  "dieOdd",
  "dieHolyTrinity",
  "dieTeeth_b",
  "die_Kralova",
  "dieAdversity",
  "dieNormal",
  "die_aranka",
  "die_Tengri",
  "die_Ci",
  "die_Lu",
  "zachranaPtacka_die_trojak",
  "problemovejParchant_pearlDice",
  "dieKingdomCome",
  "zachranaPtacka_die_mud",
  "die_Gamblerova_bad",
  "zachranaPtacka_die_klobas",
  "dieDevil",
  "dieBalanced",
  "dieUnlucky",
  "die_e",
  "die_sarlatan",
  "die_Kolacova",
  "dieFavourable",
  "dieCursed",
  "zikmunduvTabor_grozavGotchaDie",
  "dieTeeth_a",
  "prepadeni_dieBarn",
  "dieBlue",
  "malir_die_r",
  "malir_die_g",
  "malir_die_b",
]).readonly();

export const DICE_VALUE_SCHEMA = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(666),
]);

export const DICE_ITEM_SCHEMA = z.object({
  id: DICE_ID_SCHEMA,
  name: DICE_NAME_SCHEMA,
  value: DICE_VALUE_SCHEMA,
  weights: DICE_WEIGHTS_SCHEMA,
});

export const DICE_DATA_ITEMS: Readonly<DiceData>[] = DICE_CATALOG.map((die) => {
  return {
    name: DICE_NAME_SCHEMA.parse(die.name),
    id: die.id,
    title: die.title,
    description: die.description,
    weights: DICE_WEIGHTS_SCHEMA.parse(die.weights),
    isDevil: die.isDevil === true,
  };
});

export const DICE_ITEMS_BY_NAME = objectFromEntries(
  DICE_DATA_ITEMS.map((die) => [die.name, die] as const),
);

export function diceIsDevil(name: DiceName): boolean {
  return DICE_ITEMS_BY_NAME[name].isDevil ?? false;
}

export function diceIsNameValid(name?: string): name is DiceName {
  if (typeof name === "string" && name.length > 0) {
    return name in DICE_ITEMS_BY_NAME;
  }
  return false;
}

export function diceCalculateValuePercentages(die: DiceData): number[] {
  const total = die.weights.reduce((a, b) => a + b, 0);
  return die.weights.map((weight) => {
    return parseFloat((weight / total).toFixed(3));
  });
}

export function diceGetMetaData(name: DiceName): DiceMetaData {
  const metaData = DICE_CATALOG.find((die) => die.name === name);
  if (!metaData) {
    throw new Error(`Dice meta data not found: ${name}`);
  }
  return metaData;
}

export function diceCreateFromNames(names: DiceName[]): DiceSet {
  const dice: DiceSet = new Set();
  for (const name of names.slice(0, DICE_AMOUNT)) {
    const die: DiceItem = {
      id: diceGenerateId(),
      name,
      value: 0,
      weights: DICE_ITEMS_BY_NAME[name].weights,
    };
    dice.add(die);
  }
  return dice;
}
