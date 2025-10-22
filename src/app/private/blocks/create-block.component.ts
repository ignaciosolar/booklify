import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert.service';

interface BlockForm {
  start: string;
  end: string;
  reason: string;
  applyAll: boolean;
  stores: string[]; // selected store ids/names
}

@Component({
  standalone: true,
  selector: 'app-create-block',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <main class="flex-1 p-6 md:p-8">
    <div class="max-w-4xl mx-auto flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Formulario de Bloqueo</h1>
        <a routerLink="/panel/bloqueos" class="text-sm inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Volver a la lista
        </a>
      </div>

      <form (ngSubmit)="submit()" class="bg-white dark:bg-background-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1" for="start_datetime">Fecha y hora de inicio</label>
              <input [(ngModel)]="form.start" name="start" required id="start_datetime" type="datetime-local" class="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="end_datetime">Fecha y hora de fin</label>
              <input [(ngModel)]="form.end" name="end" required id="end_datetime" type="datetime-local" class="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-slate-100" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="reason">Razón (Opcional)</label>
            <textarea [(ngModel)]="form.reason" name="reason" id="reason" rows="3" placeholder="Ej: Vacaciones, cita médica, etc." class="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-slate-100"></textarea>
          </div>
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-medium text-slate-900 dark:text-white">Aplicar a Tiendas</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecciona a qué tiendas se aplicará este bloqueo.</p>
            <div class="mt-4 space-y-4">
              <label class="flex items-start gap-3">
                <input [(ngModel)]="form.applyAll" name="applyAll" type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary" />
                <span class="text-sm font-medium">Todas las tiendas</span>
              </label>
              <ng-container *ngIf="!form.applyAll">
                <label class="flex items-start gap-3" *ngFor="let s of availableStores">
                  <input type="checkbox" [value]="s" (change)="toggleStore($event, s)" [checked]="form.stores.includes(s)" class="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary" />
                  <span class="text-sm">
                    <span class="font-medium">{{ s }}</span>
                  </span>
                </label>
              </ng-container>
            </div>
          </div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 flex justify-end gap-4 rounded-b-xl">
          <button type="button" (click)="cancel()" class="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
          <button type="submit" class="bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <span class="material-symbols-outlined text-base">save</span>
            <span>Crear Bloqueo</span>
          </button>
        </div>
      </form>
    </div>
  </main>
  `
})
export class CreateBlockComponent {
  private alert = inject(AlertService);
  private router = inject(Router);

  availableStores = ['Tienda Principal - Centro', 'Sucursal Norte', 'Sucursal Sur'];
  form: BlockForm = {
    start: '',
    end: '',
    reason: '',
    applyAll: false,
    stores: []
  };

  toggleStore(ev: Event, store: string) {
    const checked = (ev.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.form.stores.includes(store)) this.form.stores.push(store);
    } else {
      this.form.stores = this.form.stores.filter(s => s !== store);
    }
  }

  submit() {
    if (!this.form.start || !this.form.end) {
      this.alert.error('Debes indicar inicio y fin');
      return;
    }
    if (this.form.end <= this.form.start) {
      this.alert.error('La fecha/hora de fin debe ser posterior al inicio');
      return;
    }
    if (!this.form.applyAll && this.form.stores.length === 0) {
      this.alert.error('Selecciona al menos una tienda o marca Todas las tiendas');
      return;
    }
    // Simular guardado
    this.alert.success('Bloqueo creado correctamente');
    this.router.navigate(['/panel/bloqueos']);
  }

  cancel() {
    this.alert.info('Acción cancelada');
    this.router.navigate(['/panel/bloqueos']);
  }
}
