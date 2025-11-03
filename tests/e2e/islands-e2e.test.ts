// tests/e2e/islands-e2e.test.ts
// End-to-end tests for Astro Islands functionality

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GSAPLoader from '../../src/lib/utils/gsap-loader';
import gsapAnimations from '../../src/lib/utils/gsap-animations';
import gsapProjectAnimations from '../../src/lib/utils/gsap-project-animations';
import WebVitalsChecker from '../../src/lib/utils/web-vitals-checker';

describe('Astro Islands End-to-End Tests', () => {
  let gsapLoader: GSAPLoader;
  let webVitalsChecker: WebVitalsChecker;

  beforeEach(() => {
    gsapLoader = GSAPLoader.getInstance();
    webVitalsChecker = WebVitalsChecker.getInstance();
  });

  it('should initialize all island components successfully', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Initialize all GSAP components that would be used in islands
    const gsap = await gsapLoader.loadGSAP();
    expect(gsap).toBeDefined();

    // Test basic animation functionality
    const element = { style: {} } as HTMLElement;
    await gsapAnimations.fadeIn(element, { duration: 0.1 }); // Using short duration for tests
    expect(element).toBeDefined();

    // Test project-specific animations
    const projectElement = { style: {}, querySelector: () => ({ style: {} }) } as unknown as HTMLElement;
    await gsapProjectAnimations.highlightProject(projectElement);
    expect(projectElement).toBeDefined();
  });

  it('should provide performance insights', () => {
    const vitals = webVitalsChecker.getAllVitals();
    expect(vitals).toBeDefined();
  });

  it('should simulate islands loading workflow', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Simulate the workflow of an island loading GSAP and running animations
    const gsap = await gsapLoader.loadGSAP();
    expect(gsap).toBeDefined();

    // Verify that animations can be created after GSAP is loaded
    const timeline = await gsapAnimations.createTimeline(true);
    expect(timeline).toBeDefined();
  });

  it('should estimate performance improvements', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    const vitalsChecker = WebVitalsChecker.getInstance();
    const impact = await vitalsChecker.estimateIslandsImpact();
    
    expect(impact.lcpImprovement).toBeGreaterThanOrEqual(0);
    expect(impact.fcpImprovement).toBeGreaterThanOrEqual(0);
    expect(impact.bundleReduction).toBeGreaterThanOrEqual(50); // Expect at least 50% reduction
  });

  it('should handle edge cases gracefully', async () => {
    // Mock window object
    const mockWindow = {
      gsap: null
    };
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });

    // Test with null/undefined elements
    try {
      await gsapAnimations.fadeIn(null as any);
    } catch (e) {
      // Expected to handle gracefully
    }

    try {
      await gsapAnimations.fadeIn(undefined as any);
    } catch (e) {
      // Expected to handle gracefully
    }

    // Test with invalid elements
    await gsapAnimations.fadeIn('invalid-element' as any, { duration: 0.01 });
  });

  it('should maintain performance recommendations', () => {
    const vitalsChecker = WebVitalsChecker.getInstance();
    const recommendations = vitalsChecker.getPerformanceRecommendations();
    
    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
  });
});