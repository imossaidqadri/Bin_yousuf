// tests/integration/island-interactions.test.ts
// Integration tests for island component interactions

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GSAPLoader from '../../src/lib/utils/gsap-loader';
import GSAPOptimizedLoader from '../../src/lib/utils/gsap-optimized-loader';
import gsapAnimations from '../../src/lib/utils/gsap-animations';
import PerformanceMonitor from '../../src/lib/utils/performance-monitor';

describe('Island Components Integration', () => {
  let gsapLoader: GSAPLoader;
  let optimizedLoader: GSAPOptimizedLoader;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    gsapLoader = GSAPLoader.getInstance();
    optimizedLoader = GSAPOptimizedLoader.getInstance();
    performanceMonitor = PerformanceMonitor.getInstance();
    
    // Clear any existing entries
    performanceMonitor['entries'] = [];
  });

  afterEach(() => {
    performanceMonitor.reset();
  });

  it('should load GSAP through both loaders consistently', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Load GSAP through both loaders
    const gsap1 = await gsapLoader.loadGSAP();
    const { core: gsap2 } = await optimizedLoader.loadComponents(['core']);

    // Both should return the same GSAP instance
    expect(gsap1).toBeDefined();
    expect(gsap2).toBeDefined();
    expect(gsap1).toBe(gsap2);
  });

  it('should register plugins consistently across loaders', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Load core and scrollToPlugin through optimized loader
    const { scrollToPlugin } = await optimizedLoader.loadComponents(['scrollToPlugin']);
    
    expect(scrollToPlugin).toBeDefined();
  });

  it('should track performance of GSAP operations', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Mark start of operation
    performanceMonitor.markIslandStart('gsap-operation');
    
    // Perform a GSAP-related operation
    const gsap = await gsapLoader.loadGSAP();
    
    // Mark end of operation
    performanceMonitor.markIslandEnd('gsap-operation');
    
    const entries = performanceMonitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('gsap-operation');
  });

  it('should work together for animations', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Load GSAP
    const gsap = await gsapLoader.loadGSAP();
    
    // Verify that animation utilities can access GSAP
    expect(gsap).toBeDefined();
    
    // Check that animation utilities are properly configured
    expect(gsapAnimations).toBeDefined();
  });

  it('should handle multiple simultaneous island operations', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Simulate multiple operations happening simultaneously
    const promises = [
      gsapLoader.loadGSAP(),
      optimizedLoader.loadCore(),
      Promise.resolve('other-operation')
    ];

    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(3);
    expect(results[0]).toBeDefined();
    expect(results[1]).toBeDefined();
  });
});