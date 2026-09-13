// import { Injectable, signal } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class SidebarService {
//   isOpen = signal(false);
//   toggle() {
//     this.isOpen.update((v) => !v);
//   }
//   close() {
//     this.isOpen.set(false);
//   }
// }


import { Injectable, signal, effect } from '@angular/core';

const MOBILE_BREAKPOINT = 640;

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _isOpen = signal(false);
  isOpen = this._isOpen.asReadonly();

  constructor() {
    // Auto-close the mobile drawer if the viewport grows past mobile size
    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && this._isOpen()) {
        this.close();
      }
    });

    // Lock body scroll while the drawer is open on mobile
    effect(() => {
      const shouldLock = this._isOpen() && window.innerWidth <= MOBILE_BREAKPOINT;
      document.body.style.overflow = shouldLock ? 'hidden' : '';
    });
  }

  toggle() {
    this._isOpen.update((v) => !v);
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}