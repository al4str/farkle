import type { DiceValue, DiceItem, DiceSet } from "src/dice/data";

export type DiceCombinationName =
  | "single_1"
  | "single_5"
  | `triplet_${Exclude<DiceValue, 0 | 666>}`
  | "straight_1_to_5"
  | "straight_2_to_6"
  | "straight_1_to_6";

export interface DiceCombinationsCheck {
  result: boolean;
  amount: number;
  countedDice: DiceSet;
  leftDice: DiceSet;
}

export interface DiceCombinationsScoring {
  countedDice: DiceSet;
  leftDice: DiceSet;
  score: number;
}

export interface DiceCombinationsItem {
  readonly name: DiceCombinationName;
  readonly check: (dice: DiceSet) => DiceCombinationsCheck;
  readonly points: (checkResult: DiceCombinationsCheck) => number;
}

export interface DiceCombinationsEvaluation {
  name: DiceCombinationName;
  points: number;
  diceCounted: DiceSet;
  diceRemaining: DiceSet;
}

const N_OF_A_KIND_MULTIPLIER: Record<number, number> = {
  4: 2,
  5: 4,
  6: 8,
};

function createCheckResult(dice: DiceSet, countedDice: DiceSet): DiceCombinationsCheck {
  return {
    result: countedDice.size > 0,
    amount: countedDice.size,
    countedDice,
    leftDice: dice.difference(countedDice),
  };
}

function createSingleCombination(value: Extract<DiceValue, 1 | 5>, points: number): DiceCombinationsItem {
  return {
    name: `single_${value}`,
    check: (dice: DiceSet): DiceCombinationsCheck => {
      const countedDice = new Set<DiceItem>();
      const match = dice.values().find((die) => die.value === value);
      if (match) {
        countedDice.add(match);
      }
      return createCheckResult(dice, countedDice);
    },
    points: (checkResult: DiceCombinationsCheck): number => (checkResult.result ? points : 0),
  };
}

function createTripletCombination(value: Exclude<DiceValue, 0 | 666>, points: number): DiceCombinationsItem {
  return {
    name: `triplet_${value}`,
    check: (dice: DiceSet): DiceCombinationsCheck => {
      const matching = new Set(dice.values().filter((die) => die.value === value || die.value === 666));
      return createCheckResult(dice, matching.size >= 3 ? matching : new Set<DiceItem>());
    },
    points: (checkResult: DiceCombinationsCheck): number =>
      checkResult.result ? points * (N_OF_A_KIND_MULTIPLIER[checkResult.amount] ?? 1) : 0,
  };
}

function diceCombinationsCheckStraight(dice: DiceSet, requiredValues: DiceValue[]): DiceCombinationsCheck {
  const diceByValue = Map.groupBy(dice, (die) => die.value);
  const devils = diceByValue.get(666) ?? [];
  const countedDice = new Set<DiceItem>();
  for (const value of requiredValues) {
    const chosen = diceByValue.get(value)?.pop() ?? devils.pop();
    if (!chosen) {
      return createCheckResult(dice, new Set<DiceItem>());
    }
    countedDice.add(chosen);
  }
  return createCheckResult(dice, countedDice);
}

function createStraightCombination(name: Extract<DiceCombinationName, `straight_${string}`>, requiredValues: DiceValue[], points: number): DiceCombinationsItem {
  return {
    name,
    check: (dice: DiceSet): DiceCombinationsCheck => diceCombinationsCheckStraight(dice, requiredValues),
    points: (checkResult: DiceCombinationsCheck): number => (checkResult.result ? points : 0),
  };
}

const COMBINATION_SINGLE_1 = createSingleCombination(1, 100);

const COMBINATION_SINGLE_5 = createSingleCombination(5, 50);

const COMBINATION_TRIPLET_1 = createTripletCombination(1, 1000);

const COMBINATION_TRIPLET_2 = createTripletCombination(2, 200);

const COMBINATION_TRIPLET_3 = createTripletCombination(3, 300);

const COMBINATION_TRIPLET_4 = createTripletCombination(4, 400);

const COMBINATION_TRIPLET_5 = createTripletCombination(5, 500);

const COMBINATION_TRIPLET_6 = createTripletCombination(6, 600);

const COMBINATION_STRAIGHT_1_TO_5 = createStraightCombination("straight_1_to_5", [1, 2, 3, 4, 5], 500);

const COMBINATION_STRAIGHT_2_TO_6 = createStraightCombination("straight_2_to_6", [2, 3, 4, 5, 6], 750);

const COMBINATION_STRAIGHT_1_TO_6 = createStraightCombination("straight_1_to_6", [1, 2, 3, 4, 5, 6], 1500);

const COMBINATIONS: readonly DiceCombinationsItem[] = [
  COMBINATION_STRAIGHT_1_TO_6,
  COMBINATION_STRAIGHT_2_TO_6,
  COMBINATION_STRAIGHT_1_TO_5,
  COMBINATION_TRIPLET_1,
  COMBINATION_TRIPLET_6,
  COMBINATION_TRIPLET_5,
  COMBINATION_TRIPLET_4,
  COMBINATION_TRIPLET_3,
  COMBINATION_TRIPLET_2,
  COMBINATION_SINGLE_1,
  COMBINATION_SINGLE_5,
];

export function diceCombinationsIsFarkle(dice: DiceSet): boolean {
  if (dice.size === 0) {
    return false;
  }
  return !COMBINATIONS.some((combination) => combination.check(dice).result);
}

export function diceCombinationsCalculateScore(dice: DiceSet): DiceCombinationsScoring {
  const countedDice = new Set<DiceItem>();
  let leftDice = new Set<DiceItem>(dice);
  let points = 0;
  while (leftDice.size > 0) {
    let noCombinationsLeft = true;
    for (const combination of COMBINATIONS) {
      const checkOutcome = combination.check(leftDice);
      if (checkOutcome.result) {
        noCombinationsLeft = false;
        for (const die of checkOutcome.countedDice) {
          countedDice.add(die);
        }
        leftDice = checkOutcome.leftDice;
        points += combination.points(checkOutcome);
        break;
      }
    }
    if (noCombinationsLeft) {
      break;
    }
  }
  return {
    countedDice,
    leftDice,
    score: points,
  };
}

export function diceCombinationsIsBankable(dice: DiceSet): boolean {
  const { countedDice, leftDice } = diceCombinationsCalculateScore(dice);
  return countedDice.size > 0 && leftDice.size === 0;
}

export function diceCombinationsEvaluate(dice: DiceSet): DiceCombinationsEvaluation[] {
  const evaluations: DiceCombinationsEvaluation[] = [];
  let remainingDice = dice;
  for (const combination of COMBINATIONS) {
    let combinationsCheck = combination.check(remainingDice);
    while (combinationsCheck.result) {
      remainingDice = combinationsCheck.leftDice;
      evaluations.push({
        name: combination.name,
        points: combination.points(combinationsCheck),
        diceCounted: combinationsCheck.countedDice,
        diceRemaining: combinationsCheck.leftDice,
      });
      combinationsCheck = combination.check(remainingDice);
    }
  }
  evaluations.sort((a, b) => b.points - a.points);
  return evaluations;
}
