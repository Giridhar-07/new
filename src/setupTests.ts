import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import 'whatwg-fetch';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 2000,
  computedStyleTimeout: 100,
  defaultHidden: true,
  eventWrapper: (cb) => {
    let result;
    act(() => {
      result = cb();
    });
    return result;
  }
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock ResizeObserver
class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

window.ResizeObserver = ResizeObserver;

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Custom matchers
expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const pass = received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(expected);
    
    return {
      pass,
      message: () => pass
        ? `Expected function not to have been called once with ${expected}`
        : `Expected function to have been called once with ${expected}`
    };
  },
  
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be within range ${floor} - ${ceiling}`
        : `Expected ${received} to be within range ${floor} - ${ceiling}`
    };
  },

  toHaveStyle(received, style) {
    const element = received.container || received;
    const computedStyle = window.getComputedStyle(element);
    const pass = Object.entries(style).every(
      ([property, value]) => computedStyle[property] === value
    );
    
    return {
      pass,
      message: () => pass
        ? `Expected element not to have style ${JSON.stringify(style)}`
        : `Expected element to have style ${JSON.stringify(style)}`
    };
  }
});

// Global test utilities
global.sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };
});

afterAll(() => {
  global.console = originalConsole;
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledOnceWith(...args: any[]): R;
      toBeWithinRange(floor: number, ceiling: number): R;
      toHaveStyle(style: Record<string, string>): R;
    }
  }

  interface Window {
    ResizeObserver: any;
  }

  function sleep(ms: number): Promise<void>;
}
function afterAll(arg0: () => any) {
    throw new Error('Function not implemented.');
}

