import * as z from "zod";
import { urlAlphabet, customAlphabet } from "nanoid";

export type DiceId = z.infer<typeof DICE_ID_SCHEMA>;

const ID_LONG_LENGTH = 21;

const ID_REGEXP = new RegExp(`^${urlAlphabet}{21}$`);

const ID_LONG_SCHEMA = z.string().length(ID_LONG_LENGTH).regex(ID_REGEXP);

const GENERATOR = customAlphabet(urlAlphabet, ID_LONG_LENGTH);

export const DICE_ID_SCHEMA = ID_LONG_SCHEMA.readonly();

export function diceGenerateId(): DiceId {
  return GENERATOR(ID_LONG_LENGTH);
}
