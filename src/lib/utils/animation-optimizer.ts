// src/lib/utils/animation-optimizer.ts
// Utility for fine-tuning animations performance in Astro Islands

interface AnimationConfig {
  duration: number;
  delay: number;
  ease: string;
  force3D: boolean;
  smoothChildTiming: boolean;
  paused: boolean;
  overwrite: boolean | string;
  stagger?: number;
}

interface OptimizedAnimation {
  config: AnimationConfig;
  performanceScore: number; // 0-100, higher is better
  recommendations: string[];
}

class AnimationOptimizer {
  private static instance: AnimationOptimizer;

  private constructor() {}

  public static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  // Optimize animation configuration for better performance
  public optimizeConfig(baseConfig: Partial<AnimationConfig>): OptimizedAnimation {
    const optimizedConfig: AnimationConfig = {
      duration: baseConfig.duration && baseConfig.duration > 0 ? baseConfig.duration : 1,
      delay: baseConfig.delay && baseConfig.delay >= 0 ? baseConfig.delay : 0,
      ease: baseConfig.ease || 'power2.out',
      force3D: baseConfig.force3D !== undefined ? baseConfig.force3D : true,
      smoothChildTiming: baseConfig.smoothChildTiming !== undefined ? baseConfig.smoothChildTiming : false,
      paused: baseConfig.paused !== undefined ? baseConfig.paused : false,
      overwrite: baseConfig.overwrite !== undefined ? baseConfig.overwrite : 'auto',
      stagger: baseConfig.stagger || 0
    };

    // Adjust for performance
    // Shorter durations are generally more performant
    if (optimizedConfig.duration > 2) {
      optimizedConfig.duration = 2;
    }

    // Use efficient easing functions
    if (!this.isEfficientEase(optimizedConfig.ease)) {
      optimizedConfig.ease = 'power2.out'; // More efficient than complex eases
    }

    // Calculate performance score (0-100)
    let performanceScore = 100;
    
    // Lower score for longer durations
    performanceScore -= Math.max(0, (optimizedConfig.duration - 0.5) * 10);
    
    // Lower score for large delays
    performanceScore -= Math.max(0, optimizedConfig.delay * 15);
    
    // Higher score for 3D force (better GPU optimization)
    if (optimizedConfig.force3D) {
      performanceScore += 5;
    }
    
    performanceScore = Math.max(10, Math.min(100, performanceScore));

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (baseConfig.duration && baseConfig.duration > 2) {
      recommendations.push('Reduce animation duration for better performance');
    }
    
    if (!this.isEfficientEase(baseConfig.ease || '')) {
      recommendations.push(`Use more efficient easing function like 'power2.out' instead of '${baseConfig.ease}'`);
    }
    
    if (baseConfig.overwrite === 'false' || baseConfig.overwrite === false) {
      recommendations.push('Consider using overwrite: "auto" to prevent animation conflicts');
    }
    
    if (!baseConfig.force3D && baseConfig.force3D !== false) {
      recommendations.push('Enable force3D for better GPU acceleration');
    }

    return {
      config: optimizedConfig,
      performanceScore,
      recommendations
    };
  }

  // Check if an easing function is efficient
  private isEfficientEase(ease: string): boolean {
    const efficientEases = [
      'power1.out', 'power1.in', 'power1.inOut',
      'power2.out', 'power2.in', 'power2.inOut',
      'power3.out', 'power3.in', 'power3.inOut',
      'power4.out', 'power4.in', 'power4.inOut',
      'linear',
      'none'
    ];

    return efficientEases.includes(ease);
  }

  // Optimize for mobile devices
  public optimizeForMobile(baseConfig: Partial<AnimationConfig>): OptimizedAnimation {
    const mobileConfig: Partial<AnimationConfig> = {
      ...baseConfig,
      duration: baseConfig.duration ? Math.max(0.3, baseConfig.duration * 0.7) : 0.7,
      force3D: true,
      overwrite: 'auto'
    };

    return this.optimizeConfig(mobileConfig);
  }

  // Optimize for accessibility (prefers-reduced-motion)
  public optimizeForReducedMotion(baseConfig: Partial<AnimationConfig>): OptimizedAnimation {
    const reducedMotionConfig: Partial<AnimationConfig> = {
      ...baseConfig,
      duration: 0.01,
      delay: 0
    };

    return this.optimizeConfig(reducedMotionConfig);
  }

  // Batch optimize multiple animations
  public batchOptimize(configs: Array<Partial<AnimationConfig>>): OptimizedAnimation[] {
    return configs.map(config => this.optimizeConfig(config));
  }

  // Get performance impact of different animation properties
  public getPerformanceImpact(): {
    properties: {
      [property: string]: {
        fpsImpact: number; // Negative number indicates FPS drop
        memoryImpact: number; // Additional memory usage in KB
        recommendation: string;
      };
    };
  } {
    return {
      properties: {
        'transform': {
          fpsImpact: 0.5, // Minimal FPS impact, GPU accelerated
          memoryImpact: 0,
          recommendation: 'Use transform for position/rotation/scale changes'
        },
        'opacity': {
          fpsImpact: 0.3,
          memoryImpact: 0,
          recommendation: 'Safe for animations, GPU accelerated'
        },
        'width': {
          fpsImpact: -5, // Significant FPS impact, can cause reflow
          memoryImpact: 0,
          recommendation: 'Avoid animating width, use transform: scale instead'
        },
        'height': {
          fpsImpact: -5,
          memoryImpact: 0,
          recommendation: 'Avoid animating height, use transform: scale instead'
        },
        'left/top/right/bottom': {
          fpsImpact: -3,
          memoryImpact: 0,
          recommendation: 'Use transform for positioning instead of left/top'
        },
        'color': {
          fpsImpact: -2,
          memoryImpact: 0,
          recommendation: 'Limit color animations, consider fewer color changes'
        },
        'boxShadow': {
          fpsImpact: -1,
          memoryImpact: 0,
          recommendation: 'Be cautious with complex box-shadow animations'
        }
      }
    };
  }

  // Create a performance-optimized timeline
  public createOptimizedTimeline(animations: Array<{
    target: any;
    config: Partial<AnimationConfig>;
    type: 'to' | 'from' | 'fromTo';
  }>): any {
    if (typeof window === 'undefined') {
      return null;
    }

    // Dynamically import GSAP only when needed
    return new Promise(async (resolve) => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const timeline = gsap.timeline({
        paused: false,
        smoothChildTiming: false,
        overwrite: 'auto'
      });

      animations.forEach(({ target, config, type }) => {
        const optimized = this.optimizeConfig(config);
        
        switch (type) {
          case 'to':
            timeline.to(target, optimized.config);
            break;
          case 'from':
            timeline.from(target, optimized.config);
            break;
          case 'fromTo':
            // For fromTo, we need both from and to configs
            // Using the optimized config as the 'to' config
            const fromConfig = { ...optimized.config };
            // Remove duration/delay from from config
            delete fromConfig.duration;
            delete fromConfig.delay;
            timeline.fromTo(target, fromConfig, optimized.config);
            break;
        }
      });

      resolve(timeline);
    });
  }

  // Check if animations should be disabled based on device performance
  public shouldReduceAnimations(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      return true;
    }

    // Check for performance mode (if available)
    // @ts-ignore - deviceMemory is not standard but available in some browsers
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true; // Low memory device
    }

    // Check for save-data preference
    // @ts-ignore - saveData is not standard but available in some browsers
    if (navigator.connection && navigator.connection.saveData) {
      return true;
    }

    return false;
  }
}

export default AnimationOptimizer;