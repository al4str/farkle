import type { JSX } from "solid-js";
import { splitProps, For, Show } from "solid-js";
import { clsx } from "clsx";

import { i18nGetLanguage } from "src/i18n/language";
import { A } from "@solidjs/router";

import styles from "src/ui/Breadcrumbs/styles.module.css";

export interface UiBreadcrumbsItem {
  label: string;
  to?: string;
}

type Element = Omit<JSX.HTMLAttributes<HTMLElement>, "children">;

export interface UiBreadcrumbsProps extends Element {
  items: UiBreadcrumbsItem[];
}

export function UiBreadcrumbs(props: UiBreadcrumbsProps) {
  const [local, rest] = splitProps(props, ["class", "items"]);
  const language = i18nGetLanguage();

  const hrefFor = (to: string): string => {
    return `/${language}${to}`;
  };

  return (
    <nav {...rest} class={clsx(styles.nav, local.class)}>
      <For each={local.items}>
        {(item, index) => {
          const isLast = () => {
            return index() === local.items.length - 1;
          };

          return (
            <span class={styles.group}>
              <Show when={index() > 0}>
                <span class={styles.divider}>&gt;</span>
              </Show>
              <Show
                when={item.to}
                fallback={(
                  <span class={clsx(isLast() && styles.current)}>
                    {item.label}
                  </span>
                )}
              >
                {(to) => (
                  <A href={hrefFor(to())} class={styles.link}>
                    {item.label}
                  </A>
                )}
              </Show>
            </span>
          );
        }}
      </For>
    </nav>
  );
}
