// tests/unit/performance-monitor.test.ts
// Unit tests for performance monitor utility

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PerformanceMonitor from '../../src/lib/utils/performance-monitor';

describe('PerformanceMonitor', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = PerformanceMonitor.getInstance();
    // Clear any existing entries
    performanceMonitor['entries'] = [];
  });

  afterEach(() => {
    performanceMonitor.reset();
  });

  it('should create a singleton instance', () => {
    const instance1 = PerformanceMonitor.getInstance();
    const instance2 = PerformanceMonitor.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('should add entry when island starts and ends', () => {
    const islandName = 'test-island';
    
    performanceMonitor.markIslandStart(islandName);
    performanceMonitor.markIslandEnd(islandName);
    
    const entries = performanceMonitor.getEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe(islandName);
  });

  it('should calculate average duration correctly', () => {
    const islandName = 'average-test';
    
    // Mock performance API
    const mockPerformance = {
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(() => [
        { startTime: 0, duration: 100 },
        { startTime: 0, duration: 200 },
        { startTime: 0, duration: 300 }
      ])
    };
    
    Object.defineProperty(global, 'performance', {
      value: mockPerformance,
      writable: true,
    });

    // Add multiple entries
    performanceMonitor.markIslandStart(islandName);
    performanceMonitor.markIslandEnd(islandName);
    
    performanceMonitor.markIslandStart(`${islandName}-2`);
    performanceMonitor.markIslandEnd(`${islandName}-2`);
    
    performanceMonitor.markIslandStart(`${islandName}-3`);
    performanceMonitor.markIslandEnd(`${islandName}-3`);

    const average = performanceMonitor.getAverageDuration(islandName);
    // Since all entries match the name, average of 100, 200, 300 = 200
    expect(average).toBe(200);
  });

  it('should reset entries correctly', () => {
    const islandName = 'reset-test';
    
    performanceMonitor.markIslandStart(islandName);
    performanceMonitor.markIslandEnd(islandName);
    
    expect(performanceMonitor.getEntries().length).toBe(1);
    
    performanceMonitor.reset();
    
    expect(performanceMonitor.getEntries().length).toBe(0);
  });

  it('should return empty vitals when performance API not available', () => {
    // Temporarily remove performance to simulate old browsers
    const originalPerformance = global.performance;
    // @ts-ignore
    delete global.performance;

    const vitals = performanceMonitor.getCoreWebVitals();
    
    expect(vitals).toEqual({});

    // Restore performance
    Object.defineProperty(global, 'performance', {
      value: originalPerformance,
      writable: true,
    });
  });
});