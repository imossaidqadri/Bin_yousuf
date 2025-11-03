// src/lib/utils/gsap-optimized-loader.ts
// Optimized GSAP loader that allows for tree-shaking and minimal bundle sizes per island

interface GSAPModules {
  gsap?: any;
  ScrollToPlugin?: any;
  ScrollTrigger?: any;
}

class GSAPOptimizedLoader {
  private static instance: GSAPOptimizedLoader;
  private modules: GSAPModules = {};
  private loadedModules = new Set<string>();
  
  private constructor() {}

  public static getInstance(): GSAPOptimizedLoader {
    if (!GSAPOptimizedLoader.instance) {
      GSAPOptimizedLoader.instance = new GSAPOptimizedLoader();
    }
    return GSAPOptimizedLoader.instance;
  }

  // Load only the core GSAP library
  public async loadCore(): Promise<any> {
    if (this.loadedModules.has('core') && this.modules.gsap) {
      return this.modules.gsap;
    }

    const gsapModule = await import('gsap');
    this.modules.gsap = gsapModule.default;
    this.loadedModules.add('core');

    // Store in global for reuse across islands
    if (typeof window !== 'undefined') {
      (window as any).gsap = this.modules.gsap;
    }

    return this.modules.gsap;
  }

  // Load ScrollToPlugin when needed
  public async loadScrollToPlugin(): Promise<any> {
    if (this.loadedModules.has('scrollToPlugin') && this.modules.ScrollToPlugin) {
      return this.modules.ScrollToPlugin;
    }

    const pluginModule = await import('gsap/ScrollToPlugin');
    this.modules.ScrollToPlugin = pluginModule.default;
    this.loadedModules.add('scrollToPlugin');

    // Register with GSAP
    const gsap = await this.loadCore();
    gsap.registerPlugin(this.modules.ScrollToPlugin);

    return this.modules.ScrollToPlugin;
  }

  // Load ScrollTrigger when needed (for scroll-based animations)
  public async loadScrollTrigger(): Promise<any> {
    if (this.loadedModules.has('scrollTrigger') && this.modules.ScrollTrigger) {
      return this.modules.ScrollTrigger;
    }

    const pluginModule = await import('gsap/ScrollTrigger');
    this.modules.ScrollTrigger = pluginModule.default;
    this.loadedModules.add('scrollTrigger');

    // Register with GSAP
    const gsap = await this.loadCore();
    gsap.registerPlugin(this.modules.ScrollTrigger);

    return this.modules.ScrollTrigger;
  }

  // Load multiple GSAP components efficiently
  public async loadComponents(components: string[]): Promise<{ [key: string]: any }> {
    const loadedComponents: { [key: string]: any } = {};
    
    const promises = components.map(component => {
      switch (component) {
        case 'core':
          return this.loadCore().then(module => ({ core: module }));
        case 'scrollToPlugin':
          return this.loadScrollToPlugin().then(module => ({ scrollToPlugin: module }));
        case 'scrollTrigger':
          return this.loadScrollTrigger().then(module => ({ scrollTrigger: module }));
        default:
          console.warn(`Unknown GSAP component: ${component}`);
          return Promise.resolve({});
      }
    });

    const results = await Promise.all(promises);
    results.forEach(result => {
      Object.assign(loadedComponents, result);
    });

    return loadedComponents;
  }

  // Check if modules are loaded
  public isLoaded(module: string): boolean {
    return this.loadedModules.has(module);
  }

  // Get loaded module
  public getModule(module: string): any {
    return this.modules[module as keyof GSAPModules];
  }
}

export default GSAPOptimizedLoader;