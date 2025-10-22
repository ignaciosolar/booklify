import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private isOpenSignal = signal(false);
  isOpen = this.isOpenSignal.asReadonly();

  toggle() {
    this.isOpenSignal.update(value => !value);
  }

  close() {
    this.isOpenSignal.set(false);
  }

  open() {
    this.isOpenSignal.set(true);
  }
}