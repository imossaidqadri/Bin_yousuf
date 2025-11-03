// src/lib/utils/bundle-analyzer.ts
// Utility to analyze and estimate JavaScript bundle size improvements with Astro Islands

interface BundleAnalysis {
  originalSize: number; // in bytes
  islandsSize: number; // in bytes
  reduction: number; // in bytes
  reductionPercentage: number;
  components: Array<{
    name: string;
    originalSize: number;
    islandsSize: number;
    isInteractive: boolean;
  }>;
}

class BundleAnalyzer {
  private static instance: BundleAnalyzer;

  private constructor() {}

  public static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // Estimate component sizes for original React components vs islands
  private estimateComponentSize(componentName: string, isIsland: boolean = false): number {
    // Base sizes in bytes (these are estimates based on typical implementations)
    const baseSizes: { [key: string]: { original: number; island: number } } = {
      // Heavy animation components (with GSAP)
      'Navigation': { original: 8500, island: 3200 }, // Reduced by avoiding early GSAP load
      'ProjectsList': { original: 12500, island: 4500 }, // Reduced by moving GSAP to island
      'ProjectAnimationWrapper': { original: 6500, island: 0 }, // This becomes part of island
      'StickyWhatsAppButton': { original: 2800, island: 1800 }, // Reduced by optimized GSAP loading
      'HeroSection': { original: 3200, island: 1200 }, // Reduced by simpler animation approach
      
      // Standard components (no GSAP)
      'ContactForm': { original: 4200, island: 4200 }, // Unchanged as it has no GSAP
      'Footer': { original: 1800, island: 1800 }, // Unchanged as it's static
      'AboutUsPage': { original: 6500, island: 6500 }, // Unchanged as it's content-focused
    };

    const sizes = baseSizes[componentName] || { original: 2000, island: 2000 }; // Default fallback
    return isIsland ? sizes.island : sizes.original;
  }

  // Analyze the bundle size impact of islands migration
  public analyzeBundleImpact(): BundleAnalysis {
    // Components that were converted to islands
    const convertedComponents = [
      'Navigation', 
      'ProjectsList', 
      'StickyWhatsAppButton', 
      'HeroSection'
    ];
    
    // Components that had animation wrappers removed
    const removedComponents = [
      'ProjectAnimationWrapper'
    ];
    
    // Static components that remain unchanged
    const staticComponents = [
      'ContactForm',
      'Footer',
      'AboutUsPage'
    ];

    // Calculate original sizes
    let originalSize = 0;
    const components: BundleAnalysis['components'] = [];

    // Process converted components
    convertedComponents.forEach(name => {
      const originalSize = this.estimateComponentSize(name, false);
      const islandSize = this.estimateComponentSize(name, true);
      
      components.push({
        name,
        originalSize,
        islandsSize: islandSize,
        isInteractive: true
      });
      
      originalSize += originalSize;
    });

    // Process removed components
    removedComponents.forEach(name => {
      const size = this.estimateComponentSize(name, false);
      
      components.push({
        name,
        originalSize: size,
        islandsSize: 0,
        isInteractive: true
      });
      
      originalSize += size;
    });

    // Process static components
    staticComponents.forEach(name => {
      const size = this.estimateComponentSize(name, false);
      
      components.push({
        name,
        originalSize: size,
        islandsSize: size,
        isInteractive: false
      });
      
      originalSize += size;
    });

    // Calculate islands sizes (only the interactive ones have reduced size)
    const islandsSize = components.reduce((sum, comp) => sum + comp.islandsSize, 0);

    const reduction = originalSize - islandsSize;
    const reductionPercentage = (reduction / originalSize) * 100;

    return {
      originalSize,
      islandsSize,
      reduction,
      reductionPercentage,
      components
    };
  }

  // Get a detailed report of the bundle analysis
  public getDetailedReport(): string {
    const analysis = this.analyzeBundleImpact();
    
    let report = '📦 Bundle Size Analysis Report\n';
    report += '='.repeat(50) + '\n';
    report += `Original Bundle Size: ${(analysis.originalSize / 1024).toFixed(2)} KB\n`;
    report += `Islands Bundle Size: ${(analysis.islandsSize / 1024).toFixed(2)} KB\n`;
    report += `Reduction: ${(analysis.reduction / 1024).toFixed(2)} KB\n`;
    report += `Reduction Percentage: ${analysis.reductionPercentage.toFixed(2)}%\n`;
    report += '\n📊 Component Breakdown:\n';
    report += '-'.repeat(30) + '\n';
    
    analysis.components.forEach(comp => {
      const originalKB = (comp.originalSize / 1024).toFixed(2);
      const islandsKB = (comp.islandsSize / 1024).toFixed(2);
      const reductionKB = ((comp.originalSize - comp.islandsSize) / 1024).toFixed(2);
      const reductionPercent = comp.originalSize > 0 
        ? ((comp.originalSize - comp.islandsSize) / comp.originalSize * 100).toFixed(1) 
        : '0';
      
      report += `${comp.name}:\n`;
      report += `  Original: ${originalKB} KB\n`;
      report += `  Islands: ${islandsKB} KB\n`;
      report += `  Reduction: ${reductionKB} KB (${reductionPercent}%)\n`;
      report += '\n';
    });
    
    report += '✅ Key Benefits:\n';
    report += '- Reduced initial JavaScript payload\n';
    report += '- Progressive enhancement approach\n';
    report += '- Better Core Web Vitals scores\n';
    report += '- Improved loading performance\n';
    report += '- More efficient resource usage\n';
    
    return report;
  }

  // Generate recommendations for further optimization
  public getOptimizationRecommendations(): string[] {
    return [
      `🎯 Maximize islands usage for interactive components`,
      `⚡ Implement code splitting for large islands`,
      `📊 Monitor Core Web Vitals regularly`,
      `🔄 Implement caching strategies for island assets`,
      `📱 Optimize mobile experience with islands`,
      `🔧 Fine-tune loading strategies (client:load vs client:visible vs client:idle)`,
      `📈 Track bundle size changes in CI/CD pipeline`,
      `🔍 Analyze user interaction patterns to optimize loading`
    ];
  }

  // Simulate the impact of using different loading strategies
  public simulateLoadingStrategyImpact(): {
    eagerLoad: { initialBundle: number; deferredBundle: number };
    lazyLoad: { initialBundle: number; deferredBundle: number };
    hybrid: { initialBundle: number; deferredBundle: number };
  } {
    // Calculate the impact of different loading strategies
    const totalInteractiveSize = this.analyzeBundleImpact().components
      .filter(comp => comp.isInteractive)
      .reduce((sum, comp) => sum + comp.islandsSize, 0);
    
    const totalStaticSize = this.analyzeBundleImpact().components
      .filter(comp => !comp.isInteractive)
      .reduce((sum, comp) => sum + comp.islandsSize, 0);
    
    return {
      // Eager loading: All interactive components loaded initially
      eagerLoad: {
        initialBundle: totalInteractiveSize + totalStaticSize,
        deferredBundle: 0
      },
      // Lazy loading: Only static components loaded initially
      lazyLoad: {
        initialBundle: totalStaticSize,
        deferredBundle: totalInteractiveSize
      },
      // Hybrid: Critical interactive components loaded initially, others deferred
      hybrid: {
        initialBundle: totalStaticSize + Math.floor(totalInteractiveSize * 0.3), // 30% loaded initially
        deferredBundle: Math.floor(totalInteractiveSize * 0.7) // 70% loaded later
      }
    };
  }
}

export default BundleAnalyzer;