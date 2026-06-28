- This project aims to 100% type-safety, which means:
  - Never use `any`;
  - Never use `!` type assertion, prefer custom guards;
  - Type casting – is last resort, when it is impossible to solve otherwise;
    - Prefer custom functions that "hide" type casting;
- Code style:
  - Always use double quotes by default;
  - 2 spaces instead of tab;
  - Always import types separately;
    ```typescript
       import type { MyType } from "myModule";
       import { myMethod } from "myModule";
     ```
  - Use TypeScript path aliasing:
    - Wrong: `./myModule`;
    - Wrong: `../../myModule`;
    - Correct `src/myNamespace/myModule`;
  - Sort imports:
    - First, goes Node.js specific imports;
    - <empty line>;
    - Then, libraries from `node_modules`;
    - <empty line>;
    - And finally, imports from `src`;
    - Inside every import "category", first goes:
      - Types;
      - Constants;
      - Classes;
      - Functions;
      - Components;
      - And files (like assets, fonts, everything else);
  - Don't write useless/obvious comments if code is readable;
  - Always use named export (unless it breaks something, e.g. routing library);
  - When exporting anything, use namespace reverse notation:
    - Wrong: `export type ActionSubject`;
    - Correct: `export type NamespaceSubjectAction`;
  - When typing with `null` or `undefined` put them before, not after:
    - Wrong: `type Foo = string | underfined`;
    - Correct: `type Foo = undefined | string`;
- Run Oxlint/TypeScript checks via `bun run check`;
