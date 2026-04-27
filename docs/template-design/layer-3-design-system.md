# Layer 3: Design System

**Status:** Proposed (Phase 2)
**Frame:** B
**Hard constraints applied:** Brand palette locked

---

## Approach

**Tailwind 4 + shadcn-style components**

Reasoning: Modern, maintainable, AI-friendly (Claude understands Tailwind well).

NOT: Material UI (heavy, CSS-in-JS conflict), Chakra UI (lock-in), pure custom (reinvent wheel).

## Design tokens

`packages/ui/src/tokens/`:

```typescript
// brand.ts (TEMPLATE — replaced during instantiation)
export const brand = {
  primary: '#FFDD00',       // Yellow (placeholder)
  secondary: '#1E3A8A',     // Navy (placeholder)
  accent: '#F2B84C',        // Orange (placeholder)
};

// skill colors (taxonomy, not brand — universal)
export const skill = {
  listening: '#0EA5E9',
  reading: '#6366F1',
  writing: '#D97706',
  speaking: '#E11D48',
};

// semantic colors
export const semantic = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// gray scale
export const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  // ... up to 900
};
```

## Tailwind config

`packages/ui/tailwind.config.ts`:

```typescript
import { brand, skill, semantic, gray } from './src/tokens';

export default {
  content: ['../../apps/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand,
        skill,
        ...semantic,
        gray,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // 4-point grid
        // 1 = 4px, 2 = 8px, 4 = 16px, 8 = 32px
      },
    },
  },
};
```

## Initial components (shadcn-style)

3 components for v0.1 template:

**Button:**
```typescript
// packages/ui/src/components/Button/Button.tsx
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Variants
        variant === 'primary' && 'bg-brand-primary text-black hover:bg-brand-primary/90',
        variant === 'secondary' && 'bg-brand-secondary text-white hover:bg-brand-secondary/90',
        variant === 'ghost' && 'hover:bg-gray-100',
        variant === 'destructive' && 'bg-error text-white hover:bg-error/90',
        // Sizes
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-lg',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
```

**Input:**
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label>{label}</label>}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary',
          error && 'border-error',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
);
```

**Card:**
```typescript
export const Card = ({ children, className }: CardProps) => (
  <div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
    {children}
  </div>
);

export const CardHeader = ({ children }: { children: ReactNode }) => (
  <div className="space-y-1.5 pb-4">{children}</div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

export const CardContent = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
```

## Component playground

`apps/web/src/app/(dev)/playground/page.tsx`:

Showcase all components with all variants. Dev-only route (NEXT_PUBLIC_ENV=development).

```typescript
export default function Playground() {
  return (
    <div>
      <section>
        <h2>Buttons</h2>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        {/* ... all variants */}
      </section>
      <section>
        <h2>Inputs</h2>
        {/* ... all states */}
      </section>
      {/* ... all components */}
    </div>
  );
}
```

## Accessibility

- Semantic HTML
- ARIA attributes where appropriate
- Keyboard navigation
- Focus visible states
- Color contrast WCAG AA minimum

Use Radix UI primitives for complex components (modals, dropdowns, tooltips) when needed.

## Mobile parity

Components share design tokens, không share React code (Expo uses React Native, not React DOM).

`apps/mobile/` reuses tokens via `@woo/ui/tokens` import. Implements components in React Native syntax.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling | Tailwind 4 | AI-friendly, mature |
| Component pattern | shadcn-style | Copy-paste, customizable |
| Initial components | 3 (Button, Input, Card) | Foundation for first features |
| Tokens approach | TypeScript objects | Type-safe, IDE autocomplete |
| Mobile parity | Tokens shared, components separate | RN vs DOM divergence |
| Accessibility | WCAG AA baseline | Inclusive default |

---

*End of layer-3-design-system.md*
