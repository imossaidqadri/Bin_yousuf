// src/lib/utils/gsap-project-animations.ts
// Project-specific GSAP animations for the Bin Yousuf Group website

import GSAPLoader from './gsap-loader';
import gsapAnimations from './gsap-animations';

class GSAPProjectAnimations {
  private gsapLoader: GSAPLoader;

  constructor() {
    this.gsapLoader = GSAPLoader.getInstance();
  }

  // Project highlight animation
  async highlightProject(element: HTMLElement): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    return new Promise((resolve) => {
      gsap
        .timeline({ onComplete: resolve })
        .to(element, {
          y: -15,
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.25)',
          duration: 0.6,
          ease: 'power2.out',
        }, 0)
        .to(
          element.querySelector('.project-image') || element,
          {
            scale: 1.02,
            duration: 0.6,
            ease: 'power2.out',
          },
          0
        )
        .to(element, {
          y: 0,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          duration: 0.6,
          ease: 'power2.out',
          delay: 1.4,
        }, 0)
        .to(
          element.querySelector('.project-image') || element,
          {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.6'
        );
    });
  }

  // Project crossfade animation for grid transitions
  async projectCrossfade(
    fromElement: HTMLElement,
    toElement: HTMLElement,
    progress: number
  ): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    if (progress < 0.95) {
      gsap.set(toElement, { opacity: 0 });
    } else if (progress >= 0.95 && progress < 1) {
      const fadeProgress = (progress - 0.95) / 0.05;
      gsap.set(fromElement, { opacity: 1 - fadeProgress });
      gsap.set(toElement, { opacity: fadeProgress });
    } else {
      gsap.set(toElement, { opacity: 1 });
      gsap.set(fromElement, {
        opacity: 0,
        pointerEvents: 'none',
      });
    }
  }

  // Sidebar show/hide animations
  async showSidebar(element: HTMLElement): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    gsap.killTweensOf(element);
    return gsapAnimations.animate(element, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  async hideSidebar(element: HTMLElement): Promise<void> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    gsap.killTweensOf(element);
    return gsapAnimations.animate(element, {
      opacity: 0,
      x: -100,
      duration: 0.3,
      ease: 'power2.in'
    });
  }

  // Complex project timeline animation
  async createProjectTimeline(element: HTMLElement): Promise<any> {
    const gsap = await this.gsapLoader.loadGSAP();
    
    // Create main timeline
    const timeline = gsap.timeline({ paused: true });

    // Set initial state
    gsap.set(element, {
      top: '100vh',
      left: '0',
      width: '100vw',
      height: '100vh',
      opacity: 0,
      borderRadius: '0px',
      zIndex: 999,
    });

    // Create animation sequence
    timeline
      // Phase 1: Scale up from bottom and fade in (0 -> 0.4)
      .to(element, {
        top: '0vh',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      // Phase 2: Shrink and move to grid position (0.4 -> 0.95)
      .to(element, {
        top: '12vh',
        left: '38vw',
        width: '60vw',
        height: '60vh',
        borderRadius: '12px',
        duration: 0.55,
        ease: 'power2.inOut',
      })
      // Phase 3: Final positioning (0.95 -> 1.0)
      .to(element, {
        duration: 0.05,
        ease: 'none',
      });
    
    return timeline;
  }
}

// Export a singleton instance
const gsapProjectAnimations = new GSAPProjectAnimations();
export default gsapProjectAnimations;