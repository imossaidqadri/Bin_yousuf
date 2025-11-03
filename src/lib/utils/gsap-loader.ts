// src/lib/utils/gsap-loader.ts
// GSAP loader utility for Astro Islands with optimized loading and caching

interface GSAPInstance {
  [key: string]: any;
}

class GSAPLoader {
  private static instance: GSAPLoader;
  private loaded: boolean = false;
  private loadingPromise: Promise<GSAPInstance> | null = null;

  private constructor() {}

  public static getInstance(): GSAPLoader {
    if (!GSAPLoader.instance) {
      GSAPLoader.instance = new GSAPLoader();
    }
    return GSAPLoader.instance;
  }

  public async loadGSAP(): Promise<GSAPInstance> {
    // Check if already loaded globally
    if (typeof window !== 'undefined' && window.gsap && this.loaded) {
      return window.gsap;
    }

    // If already loading, return existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Start loading
    this.loadingPromise = this.loadGSAPInternal();
    return this.loadingPromise;
  }

  private async loadGSAPInternal(): Promise<GSAPInstance> {
    if (typeof window === 'undefined') {
      throw new Error('GSAP can only be loaded in the browser');
    }

    try {
      // Dynamically import GSAP and plugins
      const [gsapModule, ScrollToPluginModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollToPlugin')
      ]);

      const gsap = gsapModule.default;
      const ScrollToPlugin = ScrollToPluginModule.default;

      // Register plugins
      gsap.registerPlugin(ScrollToPlugin);

      // Store in global for reuse
      (window as any).gsap = gsap;
      this.loaded = true;

      return gsap;
    } catch (error) {
      console.error('Failed to load GSAP:', error);
      throw error;
    }
  }

  public isLoaded(): boolean {
    return this.loaded && !!(typeof window !== 'undefined' && window.gsap);
  }
}

export default GSAPLoader;