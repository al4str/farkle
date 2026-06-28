export type AudioBus = "ui" | "sfx" | "music";

export type AudioFormat = "m4a" | "ogg" | "mp3" | "wav";

export interface AudioSoundDef {
  bus: AudioBus;
  variants: readonly string[];
  volume?: number;
  maxVoices?: number;
  preload?: boolean;
}

export interface AudioPlayOptions {
  volume?: number;
  rate?: number;
  bus?: AudioBus;
}

export interface AudioHandle {
  stop: () => void;
}

export interface AudioVolumes {
  master: number;
  ui: number;
  sfx: number;
  music: number;
  muted: boolean;
}
