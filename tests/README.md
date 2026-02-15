# 1TapPay Test Suite

This directory contains the test suite for 1TapPay, including property-based tests and unit tests.

## Test Structure

```
tests/
├── setup.ts                          # Test setup and configuration
├── properties/                       # Property-based tests
│   ├── paymentLink.properties.test.ts    # Payment link storage tests
│   └── validation.properties.test.ts     # Validation property tests
└── unit/                            # Unit tests
    └── utils/
        ├── storageManager.test.ts        # StorageManager edge cases
        └── paymentLinkGenerator.test.ts  # Payment link generator tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test tests/unit/utils/storageManager.test.ts
```

## Test Coverage

### Property-Based Tests (100 iterations each)
- ✅ **Property 1**: Payment Link URL Format
- ✅ **Property 2**: Payment Link Data Persistence
- ✅ **Property 3**: Username Validation
- ✅ **Property 4**: Amount Validation
- ✅ **Property 6**: Optional Note Handling

### Unit Tests
- ✅ StorageManager edge cases (localStorage full, disabled, corrupted data)
- ✅ Payment link generator validation (username, amount, note boundaries)
- ✅ Form validation with multiple error scenarios

## Test Technologies

- **Vitest**: Fast unit test framework
- **@testing-library/react**: React component testing utilities
- **@fast-check/vitest**: Property-based testing library
- **jsdom**: DOM implementation for Node.js

## Writing New Tests

### Property-Based Test Example
```typescript
import { fc } from '@fast-check/vitest';

it('should validate property', () => {
  fc.assert(
    fc.property(
      fc.string(),
      (input) => {
        // Test logic here
        expect(someFunction(input)).toBeDefined();
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Example
```typescript
it('should handle edge case', () => {
  const result = someFunction('edge-case-input');
  expect(result).toBe(expectedValue);
});
```

## Notes

- Property-based tests run 100 iterations by default
- All tests use mocked localStorage
- Tests are isolated and don't affect each other
- Coverage reports are generated in `coverage/` directory
