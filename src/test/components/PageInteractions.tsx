import { TestAudio } from "src/test/components/Audio";
import { TestInteractions } from "src/test/components/Interactions";
import styles from "src/test/components/Interactions.module.css";

export function TestPageInteractions() {
  return (
    <section class={styles["page"]}>
      <h1>
        Interactions testing page
      </h1>
      <TestInteractions />
      <TestAudio />
    </section>
  );
}

export default TestPageInteractions;
