// src/lib/utils/web-vitals-checker.ts
// Utility to measure and report Core Web Vitals for the migrated islands

interface WebVitalsResults {
  lcp?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  fcp?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  cls?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  fid?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  inp?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  ttfb?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
}

class WebVitalsChecker {
  private static instance: WebVitalsChecker;

  private constructor() {}

  public static getInstance(): WebVitalsChecker {
    if (!WebVitalsChecker.instance) {
      WebVitalsChecker.instance = new WebVitalsChecker();
    }
    return WebVitalsChecker.instance;
  }

  // Calculate rating based on thresholds
  private calculateRating(value: number, thresholds: [number, number], higherIsBetter = false): 'good' | 'needs-improvement' | 'poor' {
    const [goodThreshold, poorThreshold] = higherIsBetter 
      ? [thresholds[1], thresholds[0]] 
      : [thresholds[0], thresholds[1]];

    if (higherIsBetter) {
      if (value >= goodThreshold) return 'good';
      if (value >= poorThreshold) return 'needs-improvement';
      return 'poor';
    } else {
      if (value <= goodThreshold) return 'good';
      if (value <= poorThreshold) return 'needs-improvement';
      return 'poor';
    }
  }

  // Get Largest Contentful Paint (LCP) - should be <= 2.5s
  public getLCP(): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    // Look for LCP entries
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length === 0) {
      return null;
    }

    const lcpEntry = lcpEntries[lcpEntries.length - 1] as PerformanceEntry;
    const value = lcpEntry.startTime;
    const rating = this.calculateRating(value, [2500, 4000]); // Good <= 2.5s, Poor > 4s

    return { value, rating };
  }

  // Get First Contentful Paint (FCP) - should be <= 1.8s
  public getFCP(): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const fcpEntries = performance.getEntriesByName('first-contentful-paint');
    if (fcpEntries.length === 0) {
      return null;
    }

    const value = fcpEntries[0].startTime;
    const rating = this.calculateRating(value, [1800, 3000]); // Good <= 1.8s, Poor > 3s

    return { value, rating };
  }

  // Get Cumulative Layout Shift (CLS) - should be <= 0.1
  public getCLS(): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return null;
    }

    // CLS is calculated as the sum of unexpected layout shifts
    let clsValue = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    
    for (const entry of clsEntries) {
      if (!(entry as any).hadRecentInput) { // Only count if no recent input
        clsValue += (entry as any).value;
      }
    }

    const rating = this.calculateRating(clsValue, [0.1, 0.25]); // Good <= 0.1, Poor > 0.25

    return { value: clsValue, rating };
  }

  // Get First Input Delay (FID) or Interaction to Next Paint (INP) - should be <= 100ms
  public getFID(): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    // FID is not available after page load, so we'll return the best available FID
    const fidEntries = performance.getEntriesByName('first-input');
    if (fidEntries.length === 0) {
      return null;
    }

    const fidEntry = fidEntries[0];
    // FID is the time between the first input and when the browser starts processing it
    const value = fidEntry.processingStart - fidEntry.startTime;
    const rating = this.calculateRating(value, [100, 300]); // Good <= 100ms, Poor > 300ms

    return { value, rating };
  }

  // Get Time to First Byte (TTFB) - should be <= 800ms
  public getTTFB(): { value: number; rating: 'good' | 'needs-improvement' | 'poor' } | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (!navigationEntry) {
      return null;
    }

    // TTFB is the time from request start to response start
    const value = (navigationEntry as PerformanceNavigationTiming).responseStart - 
                  (navigationEntry as PerformanceNavigationTiming).requestStart;
    
    const rating = this.calculateRating(value, [800, 1800]); // Good <= 800ms, Poor > 1800ms

    return { value, rating };
  }

  // Get all Core Web Vitals
  public getAllVitals(): WebVitalsResults {
    return {
      lcp: this.getLCP() || undefined,
      fcp: this.getFCP() || undefined,
      cls: this.getCLS() || undefined,
      fid: this.getFID() || undefined,
      ttfb: this.getTTFB() || undefined
    };
  }

  // Report Web Vitals to analytics (simulation)
  public reportVitalsToAnalytics(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Use the Web Vitals library approach or similar
    const vitals = this.getAllVitals();
    
    console.group('📊 Core Web Vitals Report');
    console.log('LCP:', vitals.lcp ? `${vitals.lcp.value}ms (${vitals.lcp.rating})` : 'N/A');
    console.log('FCP:', vitals.fcp ? `${vitals.fcp.value}ms (${vitals.fcp.rating})` : 'N/A');
    console.log('CLS:', vitals.cls ? `${vitals.cls.value} (${vitals.cls.rating})` : 'N/A');
    console.log('FID:', vitals.fid ? `${vitals.fid.value}ms (${vitals.fid.rating})` : 'N/A');
    console.log('TTFB:', vitals.ttfb ? `${vitals.ttfb.value}ms (${vitals.ttfb.rating})` : 'N/A');
    console.groupEnd();

    // In a real implementation, you would send this to an analytics service
    // navigator.sendBeacon('/analytics/vitals', JSON.stringify(vitals));
  }

  // Check if the site would perform better with islands
  public async estimateIslandsImpact(): Promise<{
    lcpImprovement?: number;
    fcpImprovement?: number;
    bundleReduction: number;
  }> {
    // This is an estimation based on islands architecture
    // In the actual implementation, this would measure before/after
    
    return {
      // With islands, LCP could improve by reducing initial JS
      lcpImprovement: 15, // 15% improvement estimate
      // FCP should improve significantly with less initial JS
      fcpImprovement: 30, // 30% improvement estimate
      // Estimating JS bundle reduction of 60-80% with islands
      bundleReduction: 70 // 70% reduction estimate
    };
  }

  // Get performance recommendations based on islands
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];

    // With islands, we can recommend:
    recommendations.push('✅ Islands reduce initial JavaScript bundle size');
    recommendations.push('✅ Lazy loading of interactive components');
    recommendations.push('✅ Better resource prioritization');
    recommendations.push('✅ Improved Core Web Vitals scores');
    recommendations.push('✅ Better performance on lower-end devices');
    recommendations.push('✅ Progressive enhancement approach');

    return recommendations;
  }
}

export default WebVitalsChecker;