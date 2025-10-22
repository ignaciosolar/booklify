import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterModule],
  template: `
  <main class="flex-1">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Servicios</h2>
          <button [routerLink]="['crear']" class="flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90">
            <span class="material-symbols-outlined">add</span>
            <span class="truncate">Crear servicio</span>
          </button>
        </div>

        <div>
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav aria-label="Tabs" class="-mb-px flex gap-6">
              <a class="shrink-0 border-b-2 border-primary px-1 pb-4 text-sm font-semibold text-primary" href="#"> Catálogo de servicios </a>
            </nav>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white dark:bg-background-dark/50 shadow">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Nombre del Servicio</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Precio base</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Duración base</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-6" scope="col"><span class="sr-only">Editar</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-background-dark/50">
                <tr *ngFor="let s of services">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    <div class="flex items-center gap-3">
                      <div [style.background-image]="'url(' + (s.img || 'https://i.pravatar.cc/100') + ')'" class="h-10 w-10 flex-shrink-0 rounded-md bg-cover bg-center"></div>
                      <span>{{ s.name }}</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ s.price }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ s.duration }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm"><span [ngClass]="s.status === 'Activo' ? 'inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300' : 'inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300'">{{ s.status }}</span></td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      type="button"
                      [routerLink]="['editar']"
                      [state]="{ service: s }"
                      (click)="$event.stopPropagation()"
                      class="text-primary hover:text-primary/80"
                      [attr.aria-label]="'Editar ' + s.name">
                      <span class="material-symbols-outlined text-base">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </main>
  `
})
export class ServicesComponent {
  services = [
    { name: 'Corte de cabello', price: '30 €', duration: '60 minutos', status: 'Activo', img: '' },
    { name: 'Manicura', price: '25 €', duration: '45 minutos', status: 'Activo', img: 'https://i.pravatar.cc/100' },
    { name: 'Masaje relajante', price: '50 €', duration: '90 minutos', status: 'Inactivo', img: '' }
  ];

  // navigation now handled by routerLink with [state] in template
}
