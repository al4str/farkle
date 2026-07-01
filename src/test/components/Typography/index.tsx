import { For } from "solid-js";

const FONT_FAMILIES = [
  { label: "KCD2", value: "\"KCD2\", var(--sans)" },
  { label: "KCD2 Display", value: "\"KCD2 Display\", var(--sans)" },
  { label: "KCD2 Subhead", value: "\"KCD2 Subhead\", var(--sans)" },
] as const;

const FONT_WEIGHTS = [
  { label: "Thin", value: 100 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Bold", value: 700 },
  { label: "Extra Bold", value: 800 },
] as const;

const FONT_STYLES = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
] as const;

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 30] as const;

// const SAMPLE = "The quick brown fox 0123456789";
const SAMPLE = "Henry Goal Opponent 2300 3000 2500";

export function TestTypography() {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "48px",
      }}
    >
      <For each={FONT_FAMILIES}>
        {(family) => (
          <section
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "24px",
            }}
          >
            <h2
              style={{
                "font-family": family.value,
                "font-size": "24px",
                "font-weight": 700,
                margin: 0,
              }}
            >
              {family.label}
            </h2>
            <For each={FONT_WEIGHTS}>
              {(weight) => (
                <For each={FONT_STYLES}>
                  {(fontStyle) => (
                    <div
                      style={{
                        display: "flex",
                        "flex-direction": "column",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          "font-family": "var(--mono)",
                          "font-size": "12px",
                          opacity: 0.6,
                        }}
                      >
                        {weight.label} ({weight.value}) · {fontStyle.label}
                      </span>
                      <For each={FONT_SIZES}>
                        {(size) => (
                          <p
                            style={{
                              "font-family": family.value,
                              "font-size": `${size}px`,
                              "font-weight": weight.value,
                              "font-style": fontStyle.value,
                              margin: 0,
                              "line-height": 1.2,
                            }}
                          >
                            {size}px {size / 16}rem — {SAMPLE}
                          </p>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              )}
            </For>
          </section>
        )}
      </For>
    </div>
  );
}
