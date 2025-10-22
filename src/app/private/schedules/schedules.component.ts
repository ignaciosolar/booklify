import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DaySchedule {
  day: string; // Lunes, ... Domingo
  start: string; // HH:mm
  end: string;   // HH:mm
  breakStart: string; // HH:mm (almuerzo/desayuno)
  breakEnd: string;   // HH:mm
  enabled: boolean; // if times are set
}

@Component({
  standalone: true,
  selector: 'app-schedules',
  imports: [CommonModule, FormsModule],
  template: `
  <main class="flex-1 p-6 md:p-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Horario de trabajo</h1>
        <p class="mt-2 text-neutral-600 dark:text-neutral-400">Configura tus horarios de trabajo para cada día de la semana.</p>
      </div>

      <!-- Alert -->
      <div *ngIf="alert" class="mb-6 rounded-md border px-4 py-3 text-sm flex items-start gap-3"
        [ngClass]="alert.type==='success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200'">
        <span class="material-symbols-outlined text-base mt-0.5">{{ alert.type==='success' ? 'check_circle' : 'error' }}</span>
        <div class="flex-1">{{ alert.message }}</div>
        <button (click)="alert=null" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div class="mb-6 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900 p-4 flex flex-col gap-4">
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="block text-xs font-semibold tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">Intervalo general</label>
            <select [(ngModel)]="globalInterval" class="w-full rounded border-neutral-300 dark:border-neutral-600 bg-transparent focus:border-primary focus:ring-primary text-sm h-10 px-3">
              <option value="15">15 minutos</option>
              <option value="20">20 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </div>
          <div class="md:col-span-2 flex items-end text-xs text-neutral-500 dark:text-neutral-400">
            Este intervalo se aplicará al cálculo de slots para todos los días activos.
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200/50 dark:divide-neutral-700/50 text-sm">
            <thead class="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Día</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hora de inicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hora de fin</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Inicio break</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fin break</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
              <tr *ngFor="let d of days" class="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50">
                <td class="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white">{{ d.day }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <input [(ngModel)]="d.start" (change)="markEnabled(d)" type="time" class="w-32 rounded border-neutral-300 dark:border-neutral-600 bg-transparent focus:border-primary focus:ring-primary" />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <input [(ngModel)]="d.end" (change)="markEnabled(d)" type="time" class="w-32 rounded border-neutral-300 dark:border-neutral-600 bg-transparent focus:border-primary focus:ring-primary" />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <input [(ngModel)]="d.breakStart" type="time" class="w-32 rounded border-neutral-300 dark:border-neutral-600 bg-transparent focus:border-primary focus:ring-primary" />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <input [(ngModel)]="d.breakEnd" type="time" class="w-32 rounded border-neutral-300 dark:border-neutral-600 bg-transparent focus:border-primary focus:ring-primary" />
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right font-medium">
                  <button (click)="clearDay(d)" class="text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">Limpiar día</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        <button type="button" (click)="copyWeekdayToAll()" class="rounded-lg bg-neutral-200/70 dark:bg-neutral-700/60 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700">Copiar Lunes al resto</button>
        <button type="button" (click)="clearAll()" class="rounded-lg bg-neutral-200/70 dark:bg-neutral-700/60 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700">Limpiar semana</button>
        <button (click)="save()" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90">Guardar</button>
      </div>
    </div>
  </main>
  `
})
export class SchedulesComponent {
  days: DaySchedule[] = [
    { day: 'Lunes', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', enabled: true },
    { day: 'Martes', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', enabled: true },
    { day: 'Miércoles', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', enabled: true },
    { day: 'Jueves', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', enabled: true },
    { day: 'Viernes', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', enabled: true },
    { day: 'Sábado', start: '09:00', end: '14:00', breakStart: '', breakEnd: '', enabled: true },
    { day: 'Domingo', start: '', end: '', breakStart: '', breakEnd: '', enabled: false },
  ];

  globalInterval = '30';

  alert: { type: 'success' | 'error'; message: string } | null = null;

  markEnabled(d: DaySchedule) {
    d.enabled = !!(d.start && d.end);
  }

  clearDay(d: DaySchedule) {
    d.start = '';
    d.end = '';
    d.enabled = false;
  }

  copyWeekdayToAll() {
    const monday = this.days[0];
    for (let i = 1; i < this.days.length; i++) {
      this.days[i].start = monday.start;
      this.days[i].end = monday.end;
      this.days[i].breakStart = monday.breakStart;
      this.days[i].breakEnd = monday.breakEnd;
      this.days[i].enabled = monday.enabled;
    }
    this.showAlert('success', 'Horario del lunes copiado al resto');
  }

  clearAll() {
    this.days.forEach(d => { d.start = ''; d.end = ''; d.enabled = false; });
  }

  save() {
    // Validaciones
    for (const d of this.days) {
      if (d.enabled && d.start && d.end && d.end <= d.start) {
        this.showAlert('error', 'La hora final debe ser mayor que la inicial (' + d.day + ')');
        return;
      }
      if (d.breakStart && d.breakEnd) {
        if (d.breakEnd <= d.breakStart) {
          this.showAlert('error', 'Break inválido en ' + d.day);
          return;
        }
        if (d.start && d.breakStart < d.start) {
          this.showAlert('error', 'Break inicia antes de la jornada en ' + d.day);
          return;
        }
        if (d.end && d.breakEnd > d.end) {
          this.showAlert('error', 'Break termina después de la jornada en ' + d.day);
          return;
        }
      }
    }
    // Simular guardado
    this.showAlert('success', 'Horarios guardados (intervalo ' + this.globalInterval + 'm)');
  }

  showAlert(type: 'success' | 'error', message: string) {
    this.alert = { type, message };
    setTimeout(() => { if (this.alert?.message === message) this.alert = null; }, 3500);
  }
}
