import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

interface UserRow {
  email: string;
  fullName: string;
  status: 'Activo' | 'Inactivo';
  role: string;
  store: string;
  avatar?: string; // if absent we'll show placeholder icon
}

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  template: `
  <main class="flex-1">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Asociados</h1>
          <button *ngIf="currentUserRole==='Administrador'; else noInvite" (click)="openInviteModal()" type="button" class="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90">
            <span class="material-symbols-outlined">add</span>
            <span>Invitar asociado</span>
          </button>
          <ng-template #noInvite>
            <button type="button" disabled class="bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400 cursor-not-allowed px-4 py-2 rounded-lg font-medium flex items-center gap-2" title="Solo un administrador puede invitar">
              <span class="material-symbols-outlined">lock</span>
              <span>Invitar asociado</span>
            </button>
          </ng-template>
        </div>

        <!-- Filtros -->
        <div class="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm p-4 flex flex-col gap-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Buscar Email</label>
              <input type="text" [(ngModel)]="filterEmail" (ngModelChange)="applyFilters()" placeholder="ej: maria@" class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Estado</label>
              <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Tienda</label>
              <select [(ngModel)]="filterStore" (change)="applyFilters()" class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Todas</option>
                <option *ngFor="let s of stores" [value]="s">{{ s }}</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button (click)="resetFilters()" type="button" class="h-10 inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 px-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Limpiar</button>
            </div>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400">Mostrando {{ filtered.length }} de {{ users.length }} usuarios</div>
        </div>

        <div class="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-slate-600 dark:text-slate-300">
              <thead class="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" class="px-6 py-3">Email</th>
                  <th scope="col" class="px-6 py-3">Nombre Completo</th>
                  <th scope="col" class="px-6 py-3">Estado</th>
                  <th scope="col" class="px-6 py-3">Rol</th>
                  <th scope="col" class="px-6 py-3">Tienda</th>
                  <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of paged" class="bg-white dark:bg-background-dark/50 border-b last:border-0 border-slate-200 dark:border-slate-800">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <ng-container *ngIf="u.avatar; else placeholder">
                        <img [alt]="u.email" [src]="u.avatar" class="w-10 h-10 rounded-full object-cover" />
                      </ng-container>
                      <ng-template #placeholder>
                        <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <span class="material-symbols-outlined text-slate-500 dark:text-slate-400">person</span>
                        </div>
                      </ng-template>
                      <div class="font-medium text-slate-900 dark:text-white">{{ u.email }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">{{ u.fullName }}</td>
                  <td class="px-6 py-4">
                    <span *ngIf="u.status === 'Activo'; else inactive" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      <svg class="w-2 h-2 mr-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                      Activo
                    </span>
                    <ng-template #inactive>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                        <svg class="w-2 h-2 mr-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                        Inactivo
                      </span>
                    </ng-template>
                  </td>
                  <td class="px-6 py-4">{{ u.role }}</td>
                  <td class="px-6 py-4">{{ u.store }}</td>
                  <td class="px-6 py-4 text-right">
                    <button *ngIf="u.status === 'Activo'; else reactivate" (click)="confirmStatus(u,'deactivate')" class="font-medium text-red-600 dark:text-red-500 hover:underline">Dar de baja</button>
                    <ng-template #reactivate>
                      <button (click)="confirmStatus(u,'reactivate')" class="font-medium text-primary hover:underline">Reactivar</button>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <div class="text-xs text-slate-500 dark:text-slate-400">Página {{ page + 1 }} de {{ totalPages }} • {{ filtered.length }} usuarios filtrados</div>
            <div class="flex items-center gap-2">
              <label class="text-xs text-slate-500 dark:text-slate-400">Filas:
                <select [(ngModel)]="pageSize" (change)="changePageSize()" class="ml-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option *ngFor="let sz of pageSizeOptions" [value]="sz">{{ sz }}</option>
                </select>
              </label>
              <button (click)="firstPage()" [disabled]="page === 0" class="h-8 w-8 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-xs disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">«</button>
              <button (click)="prevPage()" [disabled]="page === 0" class="h-8 w-8 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-xs disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">‹</button>
              <span class="text-xs px-2">{{ page + 1 }}</span>
              <button (click)="nextPage()" [disabled]="page >= totalPages - 1" class="h-8 w-8 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-xs disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">›</button>
              <button (click)="lastPage()" [disabled]="page >= totalPages - 1" class="h-8 w-8 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-xs disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">»</button>
            </div>
          </div>
        </div>

        <!-- Modal Invitar -->
        <div *ngIf="showInviteModal" class="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeInviteModal()"></div>
          <div class="relative z-50 w-full max-w-md rounded-xl bg-white dark:bg-background-dark shadow-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6">
            <div class="flex items-start justify-between">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">person_add</span> Invitar asociado
              </h2>
              <button (click)="closeInviteModal()" class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <form (ngSubmit)="submitInvite()" #inviteForm="ngForm" class="space-y-5">
              <div>
                <label class="block text-sm font-medium mb-1">Correo</label>
                <input name="email" [(ngModel)]="inviteEmail" required email (ngModelChange)="inviteError=''" placeholder="usuario@dominio.com" class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <p *ngIf="inviteForm.submitted && !inviteEmail" class="mt-1 text-xs text-red-600">El correo es obligatorio</p>
                <p *ngIf="inviteError" class="mt-1 text-xs text-red-600">{{ inviteError }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Rol</label>
                <select name="role" [(ngModel)]="inviteRole" required class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="" disabled>Selecciona un rol</option>
                  <option *ngFor="let r of availableInviteRoles" [value]="r">{{ r }}</option>
                </select>
                <p *ngIf="inviteForm.submitted && !inviteRole" class="mt-1 text-xs text-red-600">El rol es obligatorio</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Tienda</label>
                <select name="store" [(ngModel)]="inviteStore" required class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="" disabled>Selecciona una tienda</option>
                  <option *ngFor="let s of stores" [value]="s">{{ s }}</option>
                </select>
                <p *ngIf="inviteForm.submitted && !inviteStore" class="mt-1 text-xs text-red-600">La tienda es obligatoria</p>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <button type="button" (click)="closeInviteModal()" class="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">Cancelar</button>
                <button type="submit" class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
                  <span class="material-symbols-outlined text-base">send</span> Invitar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Confirm Dialog -->
        <div *ngIf="confirmUser" class="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="cancelConfirm()"></div>
          <div class="relative z-50 w-full max-w-sm rounded-xl bg-white dark:bg-background-dark shadow-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-5">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined" [ngClass]="confirmType==='deactivate' ? 'text-red-500' : 'text-green-500'">{{ confirmType==='deactivate' ? 'warning' : 'refresh' }}</span>
              {{ confirmType==='deactivate' ? 'Dar de baja usuario' : 'Reactivar usuario' }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              ¿Seguro que deseas {{ confirmType==='deactivate' ? 'dar de baja' : 'reactivar' }} a <strong>{{ confirmUser?.email }}</strong>? Esta acción puede revertirse.
            </p>
            <div class="flex justify-end gap-3">
              <button (click)="cancelConfirm()" class="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600">Cancelar</button>
              <button (click)="confirmStatusChange()" class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow" [ngClass]="confirmType==='deactivate' ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'">
                <span class="material-symbols-outlined text-base">{{ confirmType==='deactivate' ? 'block' : 'check_circle' }}</span>
                {{ confirmType==='deactivate' ? 'Dar de baja' : 'Reactivar' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
  `
})
export class UsersComponent {
  users: UserRow[] = [
    { email: 'maria.rodriguez@example.com', fullName: 'María Rodríguez', status: 'Activo', role: 'Administrador', store: 'Central' },
    { email: 'carlos.perez@example.com', fullName: 'Carlos Pérez', status: 'Inactivo', role: 'Asociado', store: 'Sucursal Norte', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYa2erkJOFx0P7xT3HDBSFhHRVNbUET9C6tDAgUuNG7e0Pnk0vIaz5tIRGum1EyjHF0_NuPmH0333cWxgmDl8RY-Hkr_jHu3aTqq5Fvg0Kh4Y0X12YVwTYhkg89qoTKTfYKO8hFbga0C-bbKIBNEjD3TFWmpRlUHOVDX8OkIxoNAPt708izrwTEXcoxpRyVb8SCYu3jNzI-LSIL7VLWB_hfCuLMp5tTWzE5AgQtusKsS7TD5pLteWQAXNUu0sLOvamicE_l4QPpk_x' },
    { email: 'laura.garcia@example.com', fullName: 'Laura García', status: 'Activo', role: 'Asociado', store: 'Sucursal Norte', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7uALXf8NdO4NFwfAZDFBRefNhPzcsVSJfT5au7BvoymIgS1Oy_eWZIhyx9_Lehb9m3qlUbwD35x67SZUOFz5K3sKg2AmbgfEHEtjoTGgiezMipGWdrz-j0w1HfYOePSRSw4zrrjct1t-j6Q-xLWUwcKVyHtQOBFZ50tUWG5_emVuKxcSGn4WAb4SG-l6FY1jvXiPzwoZhHKtG4ksDmTnRHAySuvr-Zy2NalZKUORyUMqRnolCflHNZLO_82WdwSB2GZdVUeh-1Pyv' }
  ];

  // Filter state
  filterEmail = '';
  filterStatus: '' | 'Activo' | 'Inactivo' = '';
  filterStore = '';
  stores: string[] = [];

  filtered: UserRow[] = [];
  // Pagination
  page = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  paged: UserRow[] = [];
  totalPages = 1;

  // Current user role (simulated)
  currentUserRole: 'Administrador' | 'Asociado' = 'Administrador';

  // Invite modal state
  showInviteModal = false;
  inviteEmail = '';
  inviteRole = '';
  inviteStore = '';
  inviteError = '';
  availableInviteRoles: string[] = ['Asociado', 'Administrador'];

  // Confirm dialog state
  confirmUser: UserRow | null = null;
  confirmType: 'deactivate' | 'reactivate' | null = null;

  alertService = inject(AlertService);

  constructor() {
    this.stores = Array.from(new Set(this.users.map(u => u.store))).sort();
    this.applyFilters();
  }

  applyFilters() {
    const emailTerm = this.filterEmail.toLowerCase().trim();
    this.filtered = this.users.filter(u => {
      if (emailTerm && !u.email.toLowerCase().includes(emailTerm)) return false;
      if (this.filterStatus && u.status !== this.filterStatus) return false;
      if (this.filterStore && u.store !== this.filterStore) return false;
      return true;
    });
    this.page = 0; // reset page on filter change
    this.recomputePage();
  }

  resetFilters() {
    this.filterEmail = '';
    this.filterStatus = '';
    this.filterStore = '';
    this.applyFilters();
  }

  recomputePage() {
    this.totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    if (this.page > this.totalPages - 1) this.page = this.totalPages - 1;
    const start = this.page * this.pageSize;
    this.paged = this.filtered.slice(start, start + this.pageSize);
  }

  changePageSize() {
    this.page = 0;
    this.recomputePage();
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.recomputePage();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.recomputePage();
    }
  }

  firstPage() {
    if (this.page !== 0) {
      this.page = 0;
      this.recomputePage();
    }
  }

  lastPage() {
    if (this.page !== this.totalPages - 1) {
      this.page = this.totalPages - 1;
      this.recomputePage();
    }
  }

  // Invite Modal Methods
  openInviteModal() {
    if (this.currentUserRole !== 'Administrador') return; // enforce rule
    this.showInviteModal = true;
    this.inviteEmail = '';
    this.inviteRole = '';
    this.inviteStore = '';
    this.inviteError = '';
  }

  closeInviteModal() {
    this.showInviteModal = false;
  }

  submitInvite() {
    if (!this.inviteEmail || !this.inviteRole || !this.inviteStore) return; // template shows errors
    const emailLower = this.inviteEmail.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      this.inviteError = 'Correo inválido';
      return;
    }
    if (this.users.some(u => u.email.toLowerCase() === emailLower)) {
      this.inviteError = 'Ya existe un usuario con ese correo';
      return;
    }
    // Add new user (status Inactivo until acceptance)
    this.users.push({
      email: emailLower,
      fullName: '',
      status: 'Inactivo',
      role: this.inviteRole,
      store: this.inviteStore
    });
    if (!this.stores.includes(this.inviteStore)) {
      this.stores.push(this.inviteStore);
      this.stores.sort();
    }
    this.applyFilters();
    this.alertService.success('Invitación enviada a ' + emailLower);
    this.closeInviteModal();
  }

  // Confirm dialog methods
  confirmStatus(user: UserRow, type: 'deactivate' | 'reactivate') {
    this.confirmUser = user;
    this.confirmType = type;
  }

  cancelConfirm() {
    this.confirmUser = null;
    this.confirmType = null;
  }

  confirmStatusChange() {
    if (this.confirmUser && this.confirmType) {
      const email = this.confirmUser.email;
      if (this.confirmType === 'deactivate') {
        this.confirmUser.status = 'Inactivo';
        this.alertService.info('Usuario ' + email + ' dado de baja');
      } else {
        this.confirmUser.status = 'Activo';
        this.alertService.success('Usuario ' + email + ' reactivado');
      }
      this.applyFilters();
    }
    this.cancelConfirm();
  }
}
