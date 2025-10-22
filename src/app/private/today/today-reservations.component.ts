import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface TodayReservation {
  id: number;
  client: string;
  professional: string;
  service: string;
  time: string; // HH:mm (today)
  createdAt: Date; // when the reservation was created (for relative time demo)
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  standalone: true,
  selector: 'app-today-reservations',
  imports: [CommonModule, DatePipe],
  template: `
  <main class="flex-1 p-4 sm:p-6 md:p-10">
    <div class="mx-auto max-w-4xl">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Reservas de hoy</h2>
        <p class="mt-1 text-slate-500 dark:text-slate-400">Un vistazo en tiempo real a las citas programadas para hoy.</p>
      </div>

      <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark/60 shadow-sm">
        <div class="p-6 flex items-center justify-between gap-4 flex-wrap">
          <h3 class="text-lg font-semibold leading-tight text-slate-900 dark:text-white">Últimas reservas del día</h3>
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base text-green-500">check_circle</span> Confirmada</span>
            <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base text-amber-500">schedule</span> Pendiente</span>
            <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base text-red-500">cancel</span> Cancelada</span>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-700" *ngIf="reservations().length; else empty">
          <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            <li *ngFor="let r of reservations()" class="p-4 sm:p-6 hover:bg-background-light/50 dark:hover:bg-background-dark/40 transition-colors">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                  [ngClass]="{
                    'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300': r.status==='Confirmada',
                    'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300': r.status==='Pendiente',
                    'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300': r.status==='Cancelada'
                  }">
                  <span class="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-4">
                    <div class="truncate">
                      <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">Cliente: <span class="font-normal">{{ r.client }}</span></p>
                      <p class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ r.time }} · {{ r.professional }} · {{ r.service }}</p>
                    </div>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ relativeTime(r.createdAt) }}</span>
                  </div>
                </div>
                <span class="hidden sm:inline-flex items-center self-center rounded-full px-3 py-1 text-[10px] font-medium tracking-wide"
                  [ngClass]="{
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300': r.status==='Confirmada',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300': r.status==='Pendiente',
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300': r.status==='Cancelada'
                  }">{{ r.status }}</span>
              </div>
            </li>
          </ul>
        </div>
        <ng-template #empty>
          <div class="p-10 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-4">
            <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">event_busy</span>
            No hay reservas registradas hoy.
          </div>
        </ng-template>
      </div>
    </div>
  </main>
  `
})
export class TodayReservationsComponent {
  private now = signal<Date>(new Date());
  reservations = signal<TodayReservation[]>([
    { id: 1, client: 'Sofía Rodríguez', professional: 'Dr. Elena Ramírez', service: 'Consulta General', time: '10:00', createdAt: new Date(Date.now() - 5 * 60_000), status: 'Confirmada' },
    { id: 2, client: 'Carlos Gómez', professional: 'Dr. Elena Ramírez', service: 'Consulta de Seguimiento', time: '11:30', createdAt: new Date(Date.now() - 15 * 60_000), status: 'Confirmada' },
    { id: 3, client: 'Ana Martínez', professional: 'Dr. Elena Ramírez', service: 'Consulta de Emergencia', time: '13:00', createdAt: new Date(Date.now() - 60 * 60_000), status: 'Confirmada' },
    { id: 4, client: 'Javier López', professional: 'Dr. Elena Ramírez', service: 'Consulta de Seguimiento', time: '14:30', createdAt: new Date(Date.now() - 2 * 60 * 60_000), status: 'Pendiente' },
    { id: 5, client: 'María Hernández', professional: 'Dr. Elena Ramírez', service: 'Consulta General', time: '16:00', createdAt: new Date(Date.now() - 3 * 60 * 60_000), status: 'Cancelada' },
  ]);

  constructor() {
    // Update relative times every minute
    setInterval(() => this.now.set(new Date()), 60_000);
  }

  relativeTime(date: Date): string {
    const diffMs = this.now().getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'justo ahora';
    if (diffMin === 1) return 'hace 1 minuto';
    if (diffMin < 60) return `hace ${diffMin} minutos`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH === 1) return 'hace 1 hora';
    return `hace ${diffH} horas`;
  }
}
