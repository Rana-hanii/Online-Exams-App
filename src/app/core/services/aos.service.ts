import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AosService {
  private aos: any = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async init(options: Record<string, any> = {}) {
    if (!this.isBrowser) return;
    if (this.aos) return;

    // dynamic import so SSR doesn't try to execute AOS
    const mod = await import('aos');
    this.aos = mod.default ?? mod;
    this.aos.init({
      once: true,
      duration: 600,
      easing: 'ease-out-cubic',
      ...options,
    });
  }

  refresh() {
    if (!this.isBrowser || !this.aos) return;
    this.aos.refresh();
  }
}
