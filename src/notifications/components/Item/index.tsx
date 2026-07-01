import { Show } from "solid-js";
import { clsx } from "clsx";

import type { UiAssetsImageName } from "src/ui/AssetsImage";
import { i18nTranslate } from "src/i18n/translation";
import { uiAssetsImageIsNameValid, UiAssetsImage } from "src/ui/AssetsImage";
import styles from "src/notifications/components/Item/styles.module.css";

// --- Stubs: replace with real wiring ---
export type ClientNotificationsType =
  | "COPIED"
  | "ERROR"
  | "GAME_OVER"
  | "MUSIC_PLAYING"
  | "OFFLINE"
  | "PLAYER_CONNECTION_CHANGED"
  | "PLAYER_JOINED"
  | "PLAYER_LEFT"
  | "SERVER_DOWN";

export interface ClientNotificationsData {
  id: string;
  type: ClientNotificationsType;
  icon?: null | string;
  message?: null | string;
}

function clientNotificationsRemove(_id: string): void {}
// --- End stubs ---

export interface NotificationsItemProps {
  class?: string;
  data: ClientNotificationsData;
}

export function NotificationsItem(props: NotificationsItemProps) {
  const iconName = (): undefined | UiAssetsImageName => {
    return uiAssetsImageIsNameValid(props.data.icon) ? props.data.icon : undefined;
  };

  return (
    <button
      type="button"
      class={clsx(styles.item, props.class)}
      onClick={() => {
        clientNotificationsRemove(props.data.id);
      }}
    >
      <span class={styles.text}>
        <span class={styles.label}>
          {getLabelByType(props.data.type)}
        </span>
        <Show when={Boolean(props.data.message)}>
          <span class={styles.message}>
            {props.data.message}
          </span>
        </Show>
      </span>
      <Show when={iconName()}>
        {(name) => (
          <UiAssetsImage
            class={styles.icon}
            shadow={true}
            asset={name()}
            style={{
              width: "32px",
              height: "32px",
            }}
          />
        )}
      </Show>
    </button>
  );
}

function getLabelByType(type: ClientNotificationsType): string {
  switch (type) {
    case "ERROR":
      return i18nTranslate("notification.label.error");
    case "SERVER_DOWN":
      return i18nTranslate("notification.label.server_down");
    case "OFFLINE":
      return i18nTranslate("notification.label.offline");
    case "COPIED":
      return i18nTranslate("notification.label.copied");
    case "PLAYER_JOINED":
      return i18nTranslate("notification.label.player_joined");
    case "PLAYER_LEFT":
      return i18nTranslate("notification.label.player_left");
    case "PLAYER_CONNECTION_CHANGED":
      return i18nTranslate("notification.label.player_connection_changed");
    case "GAME_OVER":
      return i18nTranslate("game.results.title");
    case "MUSIC_PLAYING":
      return i18nTranslate("notification.label.music_playing");
    default:
      return "ヾ( ･`⌓´･)ﾉﾞ";
  }
}
