// src/lib/utils/performance-monitor.ts
// Performance monitoring utilities for Astro Islands

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of an island load
  public markIslandStart(islandName: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${islandName}-start`);
    }
  }

  // Mark the end of an island load and measure duration
  public markIslandEnd(islandName: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${islandName}-end`);
      performance.measure(islandName, `${islandName}-start`, `${islandName}-end`);
      
      const measure = performance.getEntriesByName(islandName)[0];
      if (measure) {
        const entry: PerformanceEntry = {
          name: islandName,
          startTime: measure.startTime,
          duration: measure.duration,
          timestamp: Date.now()
        };
        
        this.entries.push(entry);
        
        // Log performance for development
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Island Performance: ${islandName} took ${measure.duration.toFixed(2)}ms`);
        }
      }
    }
  }

  // Get all performance entries
  public getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  // Get average duration for an island
  public getAverageDuration(islandName: string): number {
    const islandEntries = this.entries.filter(entry => entry.name === islandName);
    if (islandEntries.length === 0) return 0;
    
    const totalDuration = islandEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalDuration / islandEntries.length;
  }

  // Start monitoring specific performance entry types
  public startMonitoring(entryTypes: string[] = ['measure', 'navigation', 'resource']): void {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entryTypes.includes(entry.entryType)) {
            const performanceEntry: PerformanceEntry = {
              name: entry.name,
              startTime: entry.startTime,
              duration: 'duration' in entry ? (entry as PerformanceEntry).duration : 0,
              timestamp: Date.now()
            };
            this.entries.push(performanceEntry);
          }
        }
      });

      observer.observe({ entryTypes });
      this.observers.push(observer);
    }
  }

  // Stop all performance monitoring
  public stopMonitoring(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
  }

  // Get Core Web Vitals if available
  public getCoreWebVitals(): {
    lcp?: number;
    fcp?: number;
    cls?: number;
    fid?: number;
  } {
    const vitals: {
      lcp?: number;
      fcp?: number;
      cls?: number;
      fid?: number;
    } = {};

    if (typeof window !== 'undefined' && 'performance' in window) {
      // LCP (Largest Contentful Paint)
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lastLCP = lcpEntries[lcpEntries.length - 1] as PerformanceEntry;
        vitals.lcp = lastLCP.startTime;
      }

      // FCP (First Contentful Paint)
      const fcpEntries = performance.getEntriesByName('first-contentful-paint');
      if (fcpEntries.length > 0) {
        vitals.fcp = fcpEntries[0].startTime;
      }
    }

    return vitals;
  }

  // Reset all entries
  public reset(): void {
    this.entries = [];
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

export default PerformanceMonitor;