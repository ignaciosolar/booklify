import { Injectable, signal } from '@angular/core';

export interface AppAlert {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _alerts = signal<AppAlert[]>([]);
  private nextId = 1;

  alerts = this._alerts.asReadonly();

  push(message: string, type: 'success' | 'info' | 'error' = 'info', timeout = 4000) {
    const id = this.nextId++;
    const alert: AppAlert = { id, message, type, timeout };
    this._alerts.update(list => [...list, alert]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(id), timeout);
    }
    return id;
  }

  success(msg: string, timeout?: number) { return this.push(msg, 'success', timeout); }
  info(msg: string, timeout?: number) { return this.push(msg, 'info', timeout); }
  error(msg: string, timeout?: number) { return this.push(msg, 'error', timeout); }

  dismiss(id: number) {
    this._alerts.update(list => list.filter(a => a.id !== id));
  }

  clear() { this._alerts.set([]); }
}
