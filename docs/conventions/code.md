# Code Conventions

## TypeScript

- Strict mode required
- No `any` without comment justification
- Prefer `unknown` over `any` when type genuinely unknown
- Use `type` for unions, `interface` for object shapes
- Export types alongside implementations

## React

- Functional components only (no class components)
- Use `forwardRef` for components wrapping DOM elements
- Hooks at top of component body
- Avoid default exports (except Next.js pages)
- Use `useCallback`/`useMemo` only when measured benefit

## Naming

| Type            | Pattern        | Example             |
| --------------- | -------------- | ------------------- |
| React component | PascalCase.tsx | UserProfile.tsx     |
| Utility         | kebab-case.ts  | format-date.ts      |
| Hook            | use-{name}.ts  | use-auth.ts         |
| Test            | {file}.test.ts | format-date.test.ts |

| Identifier | Pattern     | Example     |
| ---------- | ----------- | ----------- |
| Component  | PascalCase  | Button      |
| Function   | camelCase   | formatDate  |
| Constant   | UPPER_SNAKE | MAX_RETRY   |
| Type       | PascalCase  | UserProfile |
| Interface  | PascalCase  | ButtonProps |

Boolean variables: `is`, `has`, `should`, `can` prefix.

## Imports

```typescript
// 1. External (npm packages)
import { useState } from 'react';

// 2. Internal packages
import { Button } from '@template/ui';

// 3. App-relative
import { useAuth } from '@/hooks/use-auth';

// 4. Relative
import { helper } from './helpers';
```

## Comments

- Comments explain WHY, not WHAT
- JSDoc for public APIs
- TODO comments include context: `// TODO(2026-04-27): ...`
- No commented-out code in committed PRs
