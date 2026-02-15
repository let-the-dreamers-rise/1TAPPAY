import '@testing-library/jest-dom';
import { vi, expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage with actual storage behavior
const store = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => store.get(key) || null),
  setItem: vi.fn((key: string, value: string) => {
    store.set(key, value.toString());
  }),
  removeItem: vi.fn((key: string) => {
    store.delete(key);
  }),
  clear: vi.fn(() => {
    store.clear();
  }),
  key: vi.fn((index: number) => {
    const keys = Array.from(store.keys());
    return keys[index] || null;
  }),
  get length() {
    return store.size;
  },
};

global.localStorage = localStorageMock as any;

// Reset localStorage before each test
beforeEach(() => {
  store.clear();
});
