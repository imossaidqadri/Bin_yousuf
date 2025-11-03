// src/lib/utils/gsap-animations.ts
// Shared GSAP animation utilities for Astro Islands

import GSAPLoader from './gsap-loader';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotation?: number;
  onComplete?: () => void;
  onStart?: () => void;
}

class GSAPAnimations {
  private gsapLoader: GSAPLoader;

  constructor() {
    this.gsapLoader = GSAPLoader.getInstance();
  }

  // Basic animation function
  async animate(element: HTMLElement | string, config: AnimationConfig): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    return new Promise((resolve) => {
      const defaultConfig = {
        duration: 1,
        delay: 0,
        ease: 'power2.out',
        onComplete: resolve
      };

      const finalConfig = { ...defaultConfig, ...config };
      
      gsap.to(element, finalConfig);
    });
  }

  // Fade in animation
  async fadeIn(element: HTMLElement | string, config: AnimationConfig = {}): Promise<void> {
    const finalConfig = {
      opacity: 1,
      duration: 1,
      ...config
    };
    
    return this.animate(element, finalConfig);
  }

  // Fade out animation
  async fadeOut(element: HTMLElement | string, config: AnimationConfig = {}): Promise<void> {
    const finalConfig = {
      opacity: 0,
      duration: 0.5,
      ...config
    };
    
    return this.animate(element, finalConfig);
  }

  // Slide in from left
  async slideInLeft(element: HTMLElement | string, config: AnimationConfig = {}): Promise<void> {
    const finalConfig = {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      ...config
    };
    
    // Set initial state
    const gsap = await this.gsapLoader.loadGSAP();
    gsap.set(element, { x: -100, opacity: 0 });
    
    return this.animate(element, finalConfig);
  }

  // Slide in from right
  async slideInRight(element: HTMLElement | string, config: AnimationConfig = {}): Promise<void> {
    const finalConfig = {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      ...config
    };
    
    // Set initial state
    const gsap = await this.gsapLoader.loadGSAP();
    gsap.set(element, { x: 100, opacity: 0 });
    
    return this.animate(element, finalConfig);
  }

  // Create a timeline
  async createTimeline(pauseOnStart: boolean = true): Promise<any> {
    const gsap = await this.gsapLoader.loadGSAP();
    return gsap.timeline({ paused: pauseOnStart });
  }

  // Scroll to element
  async scrollTo(target: HTMLElement | string, offset: number = 0): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    return new Promise((resolve) => {
      gsap.to(window, {
        scrollTo: {
          y: target,
          offsetY: offset
        },
        duration: 1,
        ease: 'power2.out',
        onComplete: resolve
      });
    });
  }

  // Create a stagger animation
  async staggerFrom(elements: HTMLElement[], config: AnimationConfig, staggerValue: number = 0.1): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    return new Promise((resolve) => {
      const defaultConfig = {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: staggerValue,
        ease: 'power2.out',
        onComplete: resolve
      };

      const finalConfig = { ...defaultConfig, ...config };
      
      gsap.from(elements, finalConfig);
    });
  }
}

// Export a singleton instance
const gsapAnimations = new GSAPAnimations();
export default gsapAnimations;