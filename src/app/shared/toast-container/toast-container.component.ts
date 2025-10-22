import { Component, computed, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule, NgFor, NgClass],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80" *ngIf="alerts().length">
      <div *ngFor="let a of alerts()" class="rounded-md shadow px-4 py-3 text-sm flex items-start gap-3 border animate-fade-in"
        [ngClass]="{
          'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-800 dark:text-green-200': a.type==='success',
          'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-200': a.type==='info',
          'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-800 dark:text-red-200': a.type==='error'
        }">
        <span class="material-symbols-outlined text-base mt-0.5" [ngClass]="{
          'text-green-500 dark:text-green-300': a.type==='success',
          'text-blue-500 dark:text-blue-300': a.type==='info',
          'text-red-500 dark:text-red-300': a.type==='error'
        }">{{ a.type==='success' ? 'check_circle' : (a.type==='info' ? 'info' : 'error') }}</span>
        <div class="flex-1">{{ a.message }}</div>
        <button (click)="dismiss(a.id)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  alerts = this.alertService.alerts;
  constructor(private alertService: AlertService) {}
  dismiss(id: number) { this.alertService.dismiss(id); }
}
