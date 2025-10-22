import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="flex flex-1 flex-col w-full">
    <main class="flex-1 w-full overflow-y-auto p-6 lg:p-8">
      <!-- Notification -->
      <div *ngIf="notification.visible" class="fixed top-6 right-6 z-60">
        <div [ngClass]="notification.type === 'success' ? 'bg-green-600' : 'bg-gray-600'" class="text-white px-4 py-2 rounded shadow">{{ notification.text }}</div>
      </div>
      <div class="mb-4 w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-none">
        <div>
          <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Agenda</h1>
          <p class="text-muted-light dark:text-muted-dark">{{ selectedDate | date:'EEEE, d '}}</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative w-full md:w-48">
            <select [(ngModel)]="selectedStore" name="storeSelect" class="form-select w-full appearance-none rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Sucursal Principal</option>
              <option>Sucursal Centro</option>
            </select>
          </div>
          <div class="relative w-full md:w-48">
            <select [(ngModel)]="selectedStaff" name="staffSelect" class="form-select w-full appearance-none rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Juan Pérez (Tú)</option>
              <option>Ana Gómez</option>
            </select>
          </div>
  </div>
      </div>

      <!-- Week navigation -->
      <div class="mb-6 w-full flex items-center gap-4 justify-center">
        <button (click)="changeWeek(-1)" class="h-10 w-10 flex items-center justify-center rounded-md bg-background-light hover:bg-primary/10">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <div class="flex gap-3 overflow-auto items-center justify-center px-2">
          <button *ngFor="let d of weekDays; let i = index"
                  (click)="selectDay(d.date)"
                  [ngClass]="isSameDay(d.date, selectedDate) ? 'bg-primary text-white shadow' : 'bg-card-light text-foreground-light hover:bg-primary/10'"
                  class="flex flex-col items-center justify-center min-w-[96px] h-12 px-4 py-2 rounded-lg border border-border-light transition-all duration-150">
              <div [ngClass]="{ 'text-white': isSameDay(d.date, selectedDate), 'text-muted-light': !isSameDay(d.date, selectedDate) }" class="text-xs">{{ weekDayShort(d.date) }}</div>
              <div [ngClass]="{ 'text-white': isSameDay(d.date, selectedDate), 'text-muted-light': !isSameDay(d.date, selectedDate) }" class="text-sm font-medium">{{ formatShort(d.date) }}</div>
          </button>
        </div>

        <button (click)="changeWeek(1)" class="h-10 w-10 flex items-center justify-center rounded-md bg-background-light hover:bg-primary/10">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

  <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <!-- Example cards (unchanged) -->
          <div class="relative rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
            <div class="flex items-center justify-between">
              <p class="font-semibold">11:00</p>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Manual</span>
                <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">Confirmada</span>
              </div>
            </div>
            <div class="mt-3">
              <p class="font-bold">Tomado</p>
              <p class="text-sm text-muted-light dark:text-muted-dark">Corte de pelo</p>
              <p class="text-sm text-muted-light dark:text-muted-dark">con Sofia Ramirez</p>
            </div>
            <button class="mt-4 w-full rounded-lg border border-red-500/50 bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10">Anular</button>
          </div>
          <!-- ... other cards unchanged ... -->
          <div class="relative rounded-xl border-2 border-dashed border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 flex flex-col justify-between">
            <div>
              <p class="font-semibold">12:00</p>
              <p class="mt-3 font-bold">Disponible</p>
              <p class="text-sm text-muted-light dark:text-muted-dark">Sin cita</p>
            </div>
            <button (click)="openManualBooking('12:00', selectedDate)" class="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Agregar manual</button>
          </div>
        </div>
      </div>

      <!-- Manual booking modal (styled) -->
      <div *ngIf="manualModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Agregar reserva manual</h3>
              <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" (click)="closeManualBooking()">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form class="p-4 md:p-5" [formGroup]="manualForm" (ngSubmit)="submitManualBooking()">
              <!-- hidden fields -->
              <input type="hidden" formControlName="store" />
              <input type="hidden" formControlName="staff" />
              <input type="hidden" formControlName="date" />
              <input type="hidden" formControlName="time" />

              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2 sm:col-span-1">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Servicio</label>
                  <select formControlName="service" (change)="onServiceChange($event)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                    <option value="" disabled>Select service</option>
                    <option *ngFor="let s of availableServices" [value]="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                  <input type="text" formControlName="price" readonly class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                </div>

                <div class="col-span-2">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                  <input type="text" formControlName="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                </div>

                <div class="col-span-2 sm:col-span-1">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
                  <input type="email" formControlName="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                  <div *ngIf="manualForm.controls.email.invalid && manualForm.controls.email.touched" class="text-red-500 text-sm mt-1">Correo inválido</div>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono</label>
                  <div class="flex gap-2 items-center">
                    <select formControlName="whatsappCode" class="rounded border px-2 w-20 shrink-0">
                      <option value="+56">+56</option>
                      <option value="+1">+1</option>
                    </select>
                    <input type="tel" formControlName="whatsappNumber" class="flex-1 min-w-0 rounded border px-3 py-2" />
                  </div>
                  <div *ngIf="manualForm.controls.whatsappNumber.invalid && manualForm.controls.whatsappNumber.touched" class="text-red-500 text-sm mt-1">Número inválido (7-15 dígitos)</div>
                </div>

              </div>

              <div class="flex items-center gap-2 justify-end">
                <button type="button" (click)="closeManualBooking()" class="text-gray-500 bg-white border rounded-lg px-4 py-2">Cancelar</button>
                <button type="submit" [disabled]="manualForm.invalid" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                  Crear reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
  `
})
export class ReservasComponent {
  weekOffset = 0;
  selectedDate = new Date();
  weekDays: { date: Date }[] = [];
  selectedStore = 'Sucursal Principal';
  selectedStaff = 'Juan Pérez (Tú)';

  manualModalOpen = false;
  availableServices: { id: string; name: string; price: number }[] = [];
  private fb = inject(FormBuilder);
  manualForm = this.fb.group({
    store: [''],
    staff: [''],
    service: ['', Validators.required],
    price: [''],
    date: [''],
    time: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    whatsappCode: ['+56'],
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]]
  });

  notification = { visible: false, text: '', type: 'info' as 'info' | 'success' };

  private monthAbbr = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  private weekdayShort = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  constructor() {
    this.generateWeek();
  }

  private getMonday(d: Date) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1 - day); // adjust when sunday
    date.setDate(date.getDate() + diff + this.weekOffset * 7);
    return date;
  }

  generateWeek() {
    const today = new Date();
    const start = this.getMonday(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      this.weekDays.push({ date: d });
    }

    // ensure selectedDate is inside current week; if not, select same weekday index
    const idx = this.weekDays.findIndex(w => this.isSameDay(w.date, this.selectedDate));
    if (idx === -1) {
      // default to today if week contains today; otherwise pick first day
      const todayIdx = this.weekDays.findIndex(w => this.isSameDay(w.date, new Date()));
      this.selectedDate = todayIdx >= 0 ? this.weekDays[todayIdx].date : this.weekDays[0].date;
    }
  }

  changeWeek(dir: number) {
    // move week and select Monday of the new week
    this.weekOffset += dir;
    this.generateWeek();
    // select Monday (first day in weekDays)
    if (this.weekDays.length > 0) {
      this.selectedDate = this.weekDays[0].date;
    }
  }

  openManualBooking(time: string, date: Date) {
    // populate available services for this staff/store (simulated)
    const staff = (this.selectedStaff || '').toLowerCase();
    if (staff.includes('ana')) {
      this.availableServices = [
        { id: 'ana-1', name: 'Corte express', price: 8000 },
        { id: 'ana-2', name: 'Peinado', price: 12000 }
      ];
    } else {
      this.availableServices = [
        { id: 's1', name: 'Corte de pelo', price: 10000 },
        { id: 's2', name: 'Barba', price: 6000 }
      ];
    }

    this.manualModalOpen = true;
    this.manualForm.patchValue({
      store: this.selectedStore,
      staff: this.selectedStaff,
      service: '',
      date: date.toISOString().substring(0,10),
      time: time,
      price: '',
      name: '',
      email: '',
      whatsappCode: '+56',
      whatsappNumber: ''
    });
  }

  onServiceChange(evt: Event | string) {
    let serviceId: string;
    if (typeof evt === 'string') {
      serviceId = evt;
    } else {
      const target = evt.target as HTMLSelectElement | null;
      serviceId = target?.value ?? '';
    }
    const svc = this.availableServices.find(s => s.id === serviceId);
    this.manualForm.patchValue({ price: svc ? String(svc.price) : '' });
  }

  closeManualBooking() {
    this.manualModalOpen = false;
    // show cancelled notification
    this.showNotification('Cancelación: operación cancelada', 'info');
  }

  submitManualBooking() {
    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
      return;
    }
    const v = this.manualForm.value;
    const payload = {
      store: v.store,
      staff: v.staff,
      service: v.service,
      start: v.date + 'T' + v.time,
      name: v.name,
      email: v.email,
      whatsapp: (v.whatsappCode ?? '') + (v.whatsappNumber ?? '')
    };
    // Here you'd call a service to create the booking. We'll just log for now.
    console.log('Manual booking payload', payload);
    this.manualModalOpen = false;
    this.showNotification('Internamente creado con éxito', 'success');
  }

  showNotification(text: string, type: 'info' | 'success') {
    this.notification = { visible: true, text, type };
    setTimeout(() => this.notification.visible = false, 3000);
  }

  selectDay(d: Date) {
    this.selectedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  isSameDay(a: Date, b: Date) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  isTodaySelected() {
    const today = new Date();
    return this.isSameDay(this.selectedDate, today);
  }

  formatShort(d: Date) {
    const day = d.getDate().toString().padStart(2, '0');
    const mon = this.monthAbbr[d.getMonth()];
    return `${day}-${mon}`;
  }

  weekDayShort(d: Date) {
    // Monday index 0
    const day = d.getDay();
    const idx = day === 0 ? 6 : day - 1; // convert JS Sun(0)-Sat(6) to Mon(0)-Sun(6)
    return this.weekdayShort[idx];
  }
}
