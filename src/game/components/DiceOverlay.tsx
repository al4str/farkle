import type { Vector3 } from "three/webgpu";
import { createSignal, onMount, For, Show, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { clsx } from "clsx";

import type { DiceItem, DiceMetaData, DiceName } from "src/dice/data";
import type { Placement } from "src/utils/placeIntoRadius";
import type { InteractionsKeyCode } from "src/interactions/keys";
import type { SpatialNavigatorDirection } from "src/utils/spatialNavigator";
import { UiButton } from "src/ui/Button";
import { noop } from "src/utils/noop";
import { audioSfxPlay, audioUiPlay } from "src/audio";
import { interactionsListen } from "src/interactions";
import { diceCreateFromNames, diceGetMetaData } from "src/dice/data";
import { diceIconsGetUrl } from "src/dice/icons";
import { diceRoll } from "src/dice/roll";
import { gameRngMulberry32 } from "src/game/helpers/rng";
import { gameSeedManagerGenerateMaster } from "src/game/helpers/seedManager";
import { placeIntoRadius } from "src/utils/placeIntoRadius";
import { spatialNavigatorCreate } from "src/utils/spatialNavigator";
import styles from "src/game/components/DiceOverlay.module.css";

const DICE_NAMES = [
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
  "dieNormal",
] as const satisfies DiceName[];

const ARROW_DIRECTIONS = new Map<InteractionsKeyCode, SpatialNavigatorDirection>([
  ["ArrowUp", "up"],
  ["KeyW", "up"],
  ["ArrowRight", "right"],
  ["KeyD", "right"],
  ["ArrowDown", "down"],
  ["KeyS", "down"],
  ["ArrowLeft", "left"],
  ["KeyA", "left"],
]);

const RNG = gameRngMulberry32(gameSeedManagerGenerateMaster());

interface DiceObject extends DiceItem {
  icon: string;
  metaData: DiceMetaData;
  placement: Placement;
  object: {
    element: null | HTMLElement;
    getWorldPosition: (target: Vector3) => Vector3;
  };
}

function getDicePlacements(amount: number) {
  return placeIntoRadius({
    amount: amount,
    width: 128,
    radius: 512,
    gap: 24,
    rng: RNG,
  });
}

export function GameDiceOverlay() {
  const dice = Array.from(diceCreateFromNames(DICE_NAMES));
  const placements = getDicePlacements(dice.length);
  const [diceObjects, setDiceObjects] = createStore(dice.map((die, index): DiceObject => {
    const metaData = diceGetMetaData(die.name);
    const icon = diceIconsGetUrl(die.name);
    const placement = placements.at(index);
    if (!placement) {
      throw new Error();
    }
    return {
      ...die,
      icon,
      metaData,
      placement,
      object: {
        element: null,
        getWorldPosition: (position) => position,
      }
    };
  }));
  const [getFocusId, setFocusId] = createSignal("");

  const rollDice = () => {
    setFocusId("");
    const nextPlacements = getDicePlacements(dice.length);
    diceObjects.forEach((die, index) => {
      setDiceObjects(index, "value", diceRoll(die, RNG));
      const placement = nextPlacements.at(index);
      if (placement) {
        setDiceObjects(index, "placement", placement);
      }
    });
    audioSfxPlay("dice_to_table_multiple", { rate: 0.95 + Math.random() * 0.1 });
  };

  const onFocus = (die: DiceItem) => {
    setFocusId((prevId) => {
      return prevId === die.id ? "" : die.id;
    });
  };

  const refHandler = (index: number) => {
    return (el: HTMLElement) => {
      setDiceObjects(index, "object", "element", el);
    };
  };

  onMount(() => {
    const spatialNavigator = spatialNavigatorCreate({
      items: diceObjects.map((die) => ({
        getWorldPosition: (position: Vector3): Vector3 => {
          const el = die.object.element;
          if (el) {
            const rect = el.getBoundingClientRect();
            position.x = rect.left + rect.width / 2;
            position.z = rect.top + rect.height / 2;
          }
          return position;
        },
      })),
      isFocusable: () => true,
    });
    const off = interactionsListen(
      {
        actionId: "dice.navigate",
        bindings: [
          {
            kind: "key",
            code: "ArrowUp"
          },
          {
            kind: "key",
            code: "ArrowRight"
          },
          {
            kind: "key",
            code: "ArrowDown"
          },
          {
            kind: "key",
            code: "ArrowLeft"
          },
          {
            kind: "key",
            code: "KeyW"
          },
          {
            kind: "key",
            code: "KeyD"
          },
          {
            kind: "key",
            code: "KeyS"
          },
          {
            kind: "key",
            code: "KeyA"
          },
        ]
      },
      {
        press: {
          key: (e) => {
            if (!e.source.event.defaultPrevented) {
              e.source.event.preventDefault();
            }
            const direction = ARROW_DIRECTIONS.get(e.source.code);
            if (direction) {
              const focusedDieIndex = diceObjects.findIndex((die) => die.id === getFocusId());
              const nextIndex = spatialNavigator.next(direction, focusedDieIndex === -1 ? null : focusedDieIndex);
              if (nextIndex !== null) {
                const die = diceObjects.at(nextIndex);
                if (die) {
                  setFocusId(die.id);
                }
              }
            }
          },
        },
      },
    );
    onCleanup(off);
  });

  return (
    <div class={styles.screen}>
      <div class={styles.panel}>
        <UiButton
          label="Help"
          actionId="game.help"
          code="KeyT"
          onClick={noop}
        />
        <UiButton
          label="Re-roll"
          actionId="dice.reroll"
          code="KeyR"
          onClick={rollDice}
        />
        <UiButton
          label="Hold die"
          actionId="dice.hold"
          code="KeyE"
          onClick={noop}
        />
        <UiButton
          label="Score and continue"
          actionId="game.scoreAndContinue"
          code="KeyF"
          onClick={noop}
        />
        <UiButton
          holdable={true}
          label="Score and pass"
          actionId="game.scoreAndPass"
          code="KeyQ"
          onClick={noop}
        />
        <UiButton
          holdable={true}
          label="Give up"
          actionId="game.giveUp"
          code="Escape"
          onClick={noop}
        />
      </div>
      <ol
        class={styles.diceList}
        style={{
          position: "absolute",
          top: "calc(50% - 256px)",
          left: "calc(50% - 256px)",
          width: "512px",
          height: "512px",
        }}
      >
        <For each={diceObjects}>
          {(die, index) => {
            return (
              <li
                class={styles.diceItem}
                style={{
                  top: `${128 + die.placement.z}px`,
                  left: `${128 + die.placement.x}px`,
                }}
              >
                <Show when={getFocusId() === die.id}>
                  <div class={styles.focus} />
                </Show>
                <Die
                  die={die}
                  onRef={refHandler(index())}
                  onFocus={() => onFocus(die)}
                />
              </li>
            );
          }}
        </For>
      </ol>
    </div>
  );
}

interface DieProps {
  die: DiceObject;
  onRef: (el: HTMLElement) => void;
  onFocus: () => void;
}

function Die(props: DieProps) {
  return (
    <button
      class={styles.die}
      ref={props.onRef}
      type="button"
      aria-label={props.die.metaData.title}
      onClick={() => {
        props.onFocus();
        audioUiPlay("dice_select", { rate: 0.95 + Math.random() * 0.1 });
      }}
    >
      <img
        class={styles.icon}
        src={props.die.icon}
        alt={props.die.metaData.title}
        width={64}
        height={64}
        style={{
          transform: `rotate(${props.die.placement.angle}rad)`,
        }}
      />
      <span class={clsx(styles.selection, styles.selectionPlayer)} />
      <span class={styles.labelWrapper}>
        <span
          class={styles.value}
          data-value={props.die.value}
        />
        <span class={styles.label}>
          {props.die.metaData.title}
        </span>
      </span>
    </button>
  )
}
