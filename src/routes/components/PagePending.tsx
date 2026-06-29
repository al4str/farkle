import styles from "src/routes/components/PagePending.module.css";

export interface RoutesPagePendingProps {
  label?: string;
}

export function RoutesPagePending(props: RoutesPagePendingProps) {
  return (
    <output
      class={styles["route-pending"]}
      aria-live="polite"
    >
      <span
        class={styles["route-spinner"]}
        aria-hidden="true"
      />
      <span>
        {props.label ?? "Loading…"}
      </span>
    </output>
  );
}
