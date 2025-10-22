import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert.service';

interface BlockItem {
  id: number;
  start: string; // ISO
  end: string;   // ISO
  reason: string;
  stores: string[]; // applied stores
}

@Component({
  standalone: true,
  selector: 'app-blocks',
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
  <main class="flex-1 p-6 md:p-8">
    <div class="max-w-5xl mx-auto flex flex-col gap-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Bloqueos</h2>
        <a routerLink="crear" class="bg-primary text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm" title="Crear nuevo bloqueo">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Nuevo bloqueo</span>
        </a>
      </div>

      <div class="bg-white dark:bg-background-dark rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700" *ngIf="blocks.length; else empty">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <th class="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Inicio</th>
                <th class="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Fin</th>
                <th class="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Razón</th>
                <th class="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Tiendas</th>
                <th class="px-6 py-3 text-right font-semibold uppercase tracking-wider text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr *ngFor="let b of blocks" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-200">
                  {{ b.start | date:'dd/MM/yyyy, HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-200">
                  {{ b.end | date:'dd/MM/yyyy, HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{{ b.reason || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  <span *ngIf="b.stores.length === 0" class="italic text-slate-400">(Ninguna)</span>
                  <span *ngIf="b.stores.length === 1">{{ b.stores[0] }}</span>
                  <span *ngIf="b.stores.length > 1" class="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{{ b.stores.length }} tiendas</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-4">
                  <a class="text-primary hover:text-primary/80" [routerLink]="['editar', b.id]">Editar</a>
                  <button (click)="delete(b)" class="text-red-500 hover:text-red-600">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ng-template #empty>
        <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-10 text-center flex flex-col items-center gap-4">
          <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">block</span>
          <p class="text-slate-600 dark:text-slate-400 max-w-sm">Aún no tienes bloqueos creados. Crea uno para bloquear horarios específicos (vacaciones, eventos, mantenimientos).</p>
          <a routerLink="crear" class="bg-primary text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
            <span class="material-symbols-outlined text-base">add</span>
            Crear bloqueo
          </a>
        </div>
      </ng-template>
    </div>
  </main>
  `
})
export class BlocksComponent {
  private alert = inject(AlertService);

  blocks: BlockItem[] = [
    { id: 1, start: new Date('2025-07-15T09:00:00').toISOString(), end: new Date('2025-07-15T17:00:00').toISOString(), reason: 'Vacaciones', stores: ['Tienda Principal - Centro'] },
    { id: 2, start: new Date('2025-07-20T10:00:00').toISOString(), end: new Date('2025-07-20T12:00:00').toISOString(), reason: 'Reunión', stores: ['Sucursal Norte'] },
    { id: 3, start: new Date('2025-07-25T14:00:00').toISOString(), end: new Date('2025-07-25T16:00:00').toISOString(), reason: 'Cita médica', stores: ['Sucursal Norte', 'Sucursal Sur'] },
  ];

  delete(block: BlockItem) {
    const ok = confirm('¿Eliminar bloqueo?');
    if (!ok) return;
    this.blocks = this.blocks.filter(b => b.id !== block.id);
    this.alert.info('Bloqueo eliminado');
  }
}
