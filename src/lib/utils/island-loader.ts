// src/lib/utils/island-loader.ts
// Optimized island loading manager with prioritization and scheduling

interface IslandConfig {
  id: string;
  element: HTMLElement;
  loadingStrategy: 'eager' | 'idle' | 'visible' | 'hover' | 'click';
  priority: number; // Lower number means higher priority
  dependencies?: string[]; // IDs of islands that must load first
  loaded?: boolean;
  loading?: boolean;
}

class IslandLoader {
  private static instance: IslandLoader;
  private islands: Map<string, IslandConfig> = new Map();
  private observer: IntersectionObserver | null = null;
  private idleCallbackId: number | null = null;
  private loadQueue: IslandConfig[] = [];
  private loadingPromises: Map<string, Promise<void>> = new Map();

  private constructor() {
    this.initIntersectionObserver();
  }

  public static getInstance(): IslandLoader {
    if (!IslandLoader.instance) {
      IslandLoader.instance = new IslandLoader();
    }
    return IslandLoader.instance;
  }

  private initIntersectionObserver(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const islandId = entry.target.getAttribute('data-island-id');
              if (islandId) {
                const island = this.islands.get(islandId);
                if (island && !island.loaded && !island.loading) {
                  if (island.loadingStrategy === 'visible') {
                    this.loadIsland(islandId);
                  }
                }
              }
            }
          });
        },
        {
          rootMargin: '100px', // Start loading when island is 100px from viewport
          threshold: 0.1, // Trigger when 10% of island is visible
        }
      );
    }
  }

  public registerIsland(
    id: string,
    element: HTMLElement,
    loadingStrategy: 'eager' | 'idle' | 'visible' | 'hover' | 'click' = 'visible',
    priority: number = 1,
    dependencies?: string[]
  ): void {
    const islandConfig: IslandConfig = {
      id,
      element,
      loadingStrategy,
      priority,
      dependencies,
      loaded: false,
      loading: false
    };

    this.islands.set(id, islandConfig);

    // Add data attribute for identification
    element.setAttribute('data-island-id', id);

    // Start loading based on strategy
    switch (loadingStrategy) {
      case 'eager':
        this.loadIsland(id);
        break;
      case 'visible':
        if (this.observer) {
          this.observer.observe(element);
        }
        break;
      case 'idle':
        if ('requestIdleCallback' in window) {
          if (!this.idleCallbackId) {
            this.idleCallbackId = requestIdleCallback(() => {
              this.loadIdleIslands();
              this.idleCallbackId = null;
            });
          }
        } else {
          // Fallback to setTimeout
          setTimeout(() => this.loadIdleIslands(), 100);
        }
        break;
      case 'hover':
        element.addEventListener('mouseenter', () => {
          this.loadIsland(id);
        });
        break;
      case 'click':
        element.addEventListener('click', () => {
          this.loadIsland(id);
        });
        break;
    }
  }

  private async loadIsland(id: string): Promise<void> {
    const island = this.islands.get(id);
    if (!island || island.loaded || island.loading) {
      return;
    }

    // Check dependencies
    if (island.dependencies) {
      for (const depId of island.dependencies) {
        const dep = this.islands.get(depId);
        if (dep && !dep.loaded) {
          // Add to queue to retry later
          setTimeout(() => this.loadIsland(id), 100);
          return;
        }
      }
    }

    // Mark as loading
    island.loading = true;

    // Create loading promise to prevent duplicate loads
    const loadPromise = this.performLoad(island).finally(() => {
      this.loadingPromises.delete(id);
    });

    this.loadingPromises.set(id, loadPromise);
    return loadPromise;
  }

  private async performLoad(island: IslandConfig): Promise<void> {
    try {
      // Simulate loading work
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay to allow for any setup

      // Add loading class for visual feedback
      island.element.classList.add('island-loading');

      // Actual loading work would happen here
      // For now, just mark as loaded after a short delay
      await new Promise(resolve => setTimeout(resolve, 50));

      // Mark as loaded
      island.loaded = true;
      island.loading = false;
      island.element.classList.remove('island-loading');
      island.element.classList.add('island-loaded');

      console.log(`Island ${island.id} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load island ${island.id}:`, error);
      island.loading = false;
      island.element.classList.remove('island-loading');
      island.element.classList.add('island-error');
    }
  }

  private loadIdleIslands(): void {
    const idleIslands = Array.from(this.islands.values())
      .filter(island => !island.loaded && !island.loading && island.loadingStrategy === 'idle');

    idleIslands.forEach(island => {
      this.loadIsland(island.id);
    });
  }

  public async loadAllIslands(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    this.islands.forEach((island, id) => {
      if (!island.loaded && !island.loading) {
        promises.push(this.loadIsland(id));
      }
    });

    await Promise.all(promises);
  }

  public getIslandStatus(id: string): { loaded: boolean; loading: boolean } | null {
    const island = this.islands.get(id);
    if (!island) return null;

    return {
      loaded: island.loaded,
      loading: island.loading
    };
  }

  public getLoadStats(): {
    total: number;
    loaded: number;
    loading: number;
    error: number;
  } {
    let loaded = 0;
    let loading = 0;
    let error = 0;

    this.islands.forEach(island => {
      if (island.loaded) loaded++;
      else if (island.loading) loading++;
      else if (island.element.classList.contains('island-error')) error++;
    });

    return {
      total: this.islands.size,
      loaded,
      loading,
      error
    };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.idleCallbackId) {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(this.idleCallbackId);
      }
      this.idleCallbackId = null;
    }

    this.islands.clear();
    this.loadQueue = [];
  }
}

export default IslandLoader;