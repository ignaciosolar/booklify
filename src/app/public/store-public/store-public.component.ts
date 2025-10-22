import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';

type Pro = { id: string; name: string; avatar: string };
type Svc = { id: string; name: string; minutes: number; price: number; image: string };
type Step = 'service' | 'datetime' | 'details';

const STORAGE_KEY = 'bookingProgress';

@Component({
  standalone: true,
  selector: 'app-store-public',
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  templateUrl: './store-public.component.html',
})
export class StorePublicComponent {
  updateWhatsapp() {
    // Actualiza el valor completo de whatsapp combinando código y número
    if (this.whatsappCode && this.whatsappNumber) {
      this.whatsapp = `${this.whatsappCode}${this.whatsappNumber}`;
    } else {
      this.whatsapp = '';
    }
  }
  getSelectedProName(): string {
    const pro = this.pros().find(p => p.id === this.proId());
    return pro ? pro.name : 'Sin seleccionar';
  }
  // ===== URL/estado base =====
  slug = signal<string>('');
  storeName = computed(() =>
    this.slug()
      ? this.slug().replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
      : 'La Barbería'
  );
  serviceTitle = signal<string>('Corte de pelo');

  // ===== Flujo =====
  step = signal<Step>('service');

  // ===== Datos mock =====
  pros = signal<Pro[]>([
    { id: 'ethan',  name: 'Ethan',  avatar: 'https://i.pravatar.cc/100?img=12' },
    { id: 'liam',   name: 'Liam',   avatar: 'https://i.pravatar.cc/100?img=13' },
    { id: 'noah',   name: 'Noah',   avatar: 'https://i.pravatar.cc/100?img=14' },
    { id: 'oliver', name: 'Oliver', avatar: 'https://i.pravatar.cc/100?img=15' },
  ]);

  svcs = signal<Svc[]>([
    { id: 'haircut',       name: 'Corte de pelo',                      minutes: 30, price: 30, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=200&q=60' },
    { id: 'haircut-beard', name: 'Corte de pelo con arreglo de barba', minutes: 45, price: 45, image: 'https://images.unsplash.com/photo-1519400197429-404ae1a1e184?auto=format&fit=crop&w=200&q=60' },
    { id: 'beard',         name: 'Arreglo de barba',                   minutes: 15, price: 15, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=200&q=60' },
  ]);

  // ===== Selecciones =====
  proId = signal<string>('');            // opcional
  svcId = signal<string>('haircut');

  // Ahora require que el asociado esté seleccionado antes de poder continuar
  canContinueService = computed(() => !!this.svcId() && !!this.proId());

  // ===== Calendario =====
  today = new Date();
  monthStart = signal<Date>(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
  monthNext  = computed(() => this.addMonths(this.monthStart(), 1));

  selectedDate = signal<Date | null>(null);
  slots = signal<string[]>([]);
  selectedTime = signal<string>(''); // ej. '09:00'

  fmtMonth = (d: Date) =>
    new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(d)
      .replace(/^\w/, (m) => m.toUpperCase());
  fmtDayLabel = (d: Date) =>
    new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
      .format(d).replace(/^\w/, (m) => m.toUpperCase());

  // ===== Paso 3: Datos del cliente =====
  name = '';
  email = '';
  whatsapp = '';
  whatsappCode = '+56';
  whatsappNumber = '';

  accept = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    // slug + preselección desde query
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.slug.set(slug);
    const qp = this.route.snapshot.queryParamMap;
    const preSvc = qp.get('service');
    if (preSvc) this.svcId.set(preSvc);
    // restaurar progreso si existe
    this.loadProgress();
  }

  // ===== Navegación de pasos =====
  goToDateTime() { if (this.canContinueService()) this.step.set('datetime'); }
  backToService() { this.step.set('service'); }
  nextToDetails() { if (this.selectedDate() && this.selectedTime()) this.step.set('details'); }
  backToDateTime() { this.step.set('datetime'); }

  // ===== Calendario helpers =====
  addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  buildMonthMatrix(monthStart: Date) {
    const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    const startWeekday = (firstDay.getDay() + 7) % 7; // 0=Dom
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();

    const cells: { date: Date; inMonth: boolean; disabled: boolean }[] = [];
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(firstDay); d.setDate(d.getDate() - (startWeekday - i));
      cells.push({ date: d, inMonth: false, disabled: true });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
      const disabled = d < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      cells.push({ date: d, inMonth: true, disabled });
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const last = cells[cells.length - 1].date;
      const d = new Date(last); d.setDate(d.getDate() + 1);
      cells.push({ date: d, inMonth: false, disabled: true });
    }
    const weeks: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  weeksLeft  = computed(() => this.buildMonthMatrix(this.monthStart()));
  weeksRight = computed(() => this.buildMonthMatrix(this.monthNext()));

  prevMonth() {
    const prev = this.addMonths(this.monthStart(), -1);
    const min = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    if (prev >= min) this.monthStart.set(prev);
  }
  nextMonth() { this.monthStart.set(this.addMonths(this.monthStart(), 1)); }

  selectDate(d: Date, enabled: boolean) {
    if (!enabled) return;
    this.selectedDate.set(d);
    this.selectedTime.set('');
    // Slots mock (sábados menos)
    const base = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
    const isSat = d.getDay() === 6;
    this.slots.set(isSat ? base.slice(0, 4) : base);
  }
  selectSlot(t: string) { this.selectedTime.set(t); }

  // ===== Guardar / restaurar progreso =====
  saveProgress() {
    const payload = {
      step: this.step(),
      proId: this.proId(),
      svcId: this.svcId(),
      selectedDate: this.selectedDate() ? this.selectedDate()!.toISOString() : null,
      selectedTime: this.selectedTime(),
      name: this.name,
      email: this.email,
      whatsapp: this.whatsapp,
      accept: this.accept,
      slug: this.slug(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  loadProgress() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.slug && p.slug !== this.slug()) return; // si es de otra tienda, ignora
      if (p.proId) this.proId.set(p.proId);
      if (p.svcId) this.svcId.set(p.svcId);
      if (p.selectedDate) this.selectedDate.set(new Date(p.selectedDate));
      if (p.selectedTime) this.selectedTime.set(p.selectedTime);
      if (p.name) this.name = p.name;
      if (p.email) this.email = p.email;
      if (p.whatsapp) this.whatsapp = p.whatsapp;
      if (typeof p.accept === 'boolean') this.accept = p.accept;
      if (p.step) this.step.set(p.step as Step);
    } catch { /* ignore */ }
  }

  // auto-guardar cuando cambie algo relevante
  _auto = effect(() => {
    // Lee para establecer dependencia
    this.step(); this.proId(); this.svcId(); this.selectedDate(); this.selectedTime();
    // También guarda campos del form cuando cambien (al perder foco desde plantilla) llamamos saveProgress manual
    this.saveProgress();
  });

  // ===== Confirmar =====
  confirm() {
    if (!this.email || !this.accept || !this.selectedDate() || !this.selectedTime()) return;

    // Combina fecha + hora
    const [hh, mm] = this.selectedTime().split(':').map(Number);
    const dt = new Date(this.selectedDate()!);
    dt.setHours(hh, mm, 0, 0);

    // (Opcional) limpiar progreso
    sessionStorage.removeItem(STORAGE_KEY);

    this.router.navigate(['/booking/confirm'], {
      queryParams: {
        store: this.slug(),
        pro: this.proId() || null,
        service: this.svcId(),
        start: dt.toISOString(),
        name: this.name || null,
        email: this.email,
        whatsapp: this.whatsapp || null,
      },
    });
  }
}
