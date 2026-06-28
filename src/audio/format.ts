import type { AudioFormat } from "src/audio/types";

const SFX_PRIORITY: readonly AudioFormat[] = [
  "m4a",
  "ogg",
  "mp3",
  "wav",
];

const MIME: Record<AudioFormat, string> = {
  m4a: "audio/mp4; codecs=\"mp4a.40.2\"",
  ogg: "audio/ogg; codecs=\"vorbis\"",
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

let cached: undefined | AudioFormat;

export function audioFormatBest(): AudioFormat {
  if (cached !== undefined) {
    return cached;
  }
  cached = probe();
  return cached;
}

export function audioFormatResolveSfx(baseName: string): string {
  return `/assets/sfx/${baseName}.${audioFormatBest()}`;
}

function probe(): AudioFormat {
  const element = window.document.createElement("audio");
  for (const format of SFX_PRIORITY) {
    const support = element.canPlayType(MIME[format]);
    if (support === "probably" || support === "maybe") {
      return format;
    }
  }
  return "m4a";
}
