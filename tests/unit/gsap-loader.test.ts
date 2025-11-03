// tests/unit/gsap-loader.test.ts
// Unit tests for GSAP loader utility

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GSAPLoader from '../../src/lib/utils/gsap-loader';

// Mock the import functions
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn()
  }
}));

vi.mock('gsap/ScrollToPlugin', () => ({
  default: { name: 'ScrollToPlugin' }
}));

describe('GSAPLoader', () => {
  let gsapLoader: GSAPLoader;

  beforeEach(() => {
    // Reset the singleton instance before each test
    vi.clearAllMocks();
    gsapLoader = GSAPLoader.getInstance();
  });

  afterEach(() => {
    // Cleanup if needed
  });

  it('should create a singleton instance', () => {
    const instance1 = GSAPLoader.getInstance();
    const instance2 = GSAPLoader.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('should initially not be loaded', () => {
    expect(gsapLoader.isLoaded()).toBe(false);
  });

  it('should load GSAP successfully', async () => {
    // Mock window object for the test
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Mock the imports
    const mockGsap = {
      default: {
        registerPlugin: vi.fn(),
        timeline: vi.fn(),
        to: vi.fn(),
        from: vi.fn(),
        set: vi.fn()
      }
    };

    const mockScrollToPlugin = {
      default: { name: 'ScrollToPlugin' }
    };

    // Import actual modules to test
    const { default: actualGsap } = await import('gsap');
    const { default: actualScrollToPlugin } = await import('gsap/ScrollToPlugin');

    const result = await gsapLoader.loadGSAP();
    
    expect(result).toBeDefined();
    expect(actualGsap.registerPlugin).toHaveBeenCalledWith(actualScrollToPlugin);
  });

  it('should not load GSAP multiple times', async () => {
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    const result1 = await gsapLoader.loadGSAP();
    const result2 = await gsapLoader.loadGSAP();
    
    expect(result1).toBe(result2);
  });

  it('should throw error when loading in non-browser environment', async () => {
    // Temporarily remove window to simulate non-browser environment
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    await expect(gsapLoader.loadGSAP()).rejects.toThrow('GSAP can only be loaded in the browser');

    // Restore window
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
    });
  });
});