import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _collapsed = signal(false);

  // Expose the signal itself so templates can subscribe/react to changes
  readonly collapsed = this._collapsed;

  isCollapsed() {
    return this._collapsed();
  }

  toggle() {
    this._collapsed.update(v => !v);
  }

  open() {
    this._collapsed.set(false);
  }

  close() {
    this._collapsed.set(true);
  }
}
