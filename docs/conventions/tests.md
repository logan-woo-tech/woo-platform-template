# Test Conventions

## Types

- **Unit:** Single function/component, mocks, fast
- **Integration:** Multiple units, real dependencies
- **E2E:** Full flows through real browser

## File naming

```
src/utils/format-date.ts           # Implementation
src/utils/format-date.test.ts      # Unit test
tests/rls-isolation.integration.test.ts  # Integration
e2e/signup.spec.ts                 # E2E
```

## Structure (Arrange-Act-Assert)

```typescript
describe('formatDate', () => {
  it('formats ISO date as long form', () => {
    // Arrange
    const input = '2026-04-27';

    // Act
    const result = formatDate(input, 'long', 'en');

    // Assert
    expect(result).toBe('April 27, 2026');
  });
});
```

## Descriptions

- `describe`: name của unit
- `it`: behavior in present tense ("renders children" not "should render")

## Isolation

Each test independent. `beforeEach` resets state. Order independence required.

## Coverage

Target: 80%+ packages, 50%+ apps.
Coverage is floor, không ceiling. Focus on behaviors.
