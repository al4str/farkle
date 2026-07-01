import { createSignal, For } from "solid-js";

import type { AudioBus } from "src/audio/types";
import type { AudioSoundId } from "src/audio/catalog";
import { audioCatalogGet, audioCatalogIds } from "src/audio/catalog";
import { audioPlay, audioSetMuted, audioSetVolume } from "src/audio";
import { audioState } from "src/audio/state";
import controls from "src/test/components/Canvas/Controls.module.css";
import styles from "src/test/components/Audio/Audio.module.css";

interface VolumeKnob {
  id: "master" | AudioBus;
  label: string;
}

interface SoundGroup {
  bus: AudioBus;
  ids: readonly AudioSoundId[];
}

const VOLUME_KNOBS: readonly VolumeKnob[] = [
  { id: "master", label: "Master volume" },
  { id: "sfx", label: "SFX volume" },
  { id: "ui", label: "UI volume" },
  { id: "music", label: "Music volume" },
];

const BUS_ORDER: readonly AudioBus[] = ["sfx", "ui", "music"];

const RATE_MIN = 0.25;

const RATE_MAX = 2;

export function TestAudio() {
  const [rate, setRate] = createSignal(1);
  const [playVolume, setPlayVolume] = createSignal(1);

  return (
    <div class={controls["control-section"]}>
      <span class={controls["control-section-title"]}>
        Audio
      </span>
      <For each={VOLUME_KNOBS}>
        {(knob) => (
          <label class={controls.control}>
            <span class="control-label">
              {knob.label}
              <output class={controls["control-value"]}>
                {Math.round(audioState[knob.id] * 100)}%
              </output>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState[knob.id]}
              onInput={(event) => audioSetVolume(knob.id, event.currentTarget.valueAsNumber)}
            />
          </label>
        )}
      </For>
      <label class={`${controls.control} ${controls["control-row"]}`}>
        <span class="control-label">
          Mute
        </span>
        <input
          type="checkbox"
          checked={audioState.muted}
          onChange={(event) => audioSetMuted(event.currentTarget.checked)}
        />
      </label>
      <label class={controls.control}>
        <span class="control-label">
          Playback rate
          <output class={controls["control-value"]}>
            {rate().toFixed(2)}x
          </output>
        </span>
        <input
          type="range"
          min={RATE_MIN}
          max={RATE_MAX}
          step="0.01"
          value={rate()}
          onInput={(event) => setRate(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={controls.control}>
        <span class="control-label">
          Play volume
          <output class={controls["control-value"]}>
            {Math.round(playVolume() * 100)}%
          </output>
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={playVolume()}
          onInput={(event) => setPlayVolume(event.currentTarget.valueAsNumber)}
        />
      </label>
      <For each={soundGroups()}>
        {(group) => (
          <div class={styles["sound-group"]}>
            <span class={styles["sound-group-title"]}>
              {group.bus}
            </span>
            <div class={styles["sound-grid"]}>
              <For each={group.ids}>
                {(id) => (
                  <button
                    type="button"
                    class={styles["sound-button"]}
                    onClick={() => audioPlay(id, { rate: rate(), volume: playVolume() })}
                  >
                    {id}
                    <span class={styles["sound-button-count"]}>
                      {variantCount(id)} variant{variantCount(id) === 1 ? "" : "s"}
                    </span>
                  </button>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

function soundGroups(): readonly SoundGroup[] {
  const ids = audioCatalogIds();
  return BUS_ORDER
    .map((bus) => ({
      bus,
      ids: ids.filter((id) => audioCatalogGet(id).bus === bus),
    }))
    .filter((group) => group.ids.length > 0);
}

function variantCount(id: AudioSoundId): number {
  return audioCatalogGet(id).variants.length;
}
