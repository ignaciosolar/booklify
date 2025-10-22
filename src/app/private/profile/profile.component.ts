import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

interface ProfileForm {
  nombre: string;
  apellido: string;
  pais: string;
  rut: string;
  telefono: string;
  avatarUrl: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  template: `
  <main class="flex-1 p-6 md:p-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Mi perfil</h1>
      </header>

      <!-- (Alert toasts handled globally by ToastContainer) -->

      <form (ngSubmit)="save()" #f="ngForm" class="space-y-12">
        <!-- Personal Details -->
        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Detalles personales</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="nombre">Nombre</label>
              <input [(ngModel)]="model.nombre" name="nombre" required id="nombre" type="text" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="apellido">Apellido</label>
              <input [(ngModel)]="model.apellido" name="apellido" required id="apellido" type="text" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="pais">País</label>
              <select [(ngModel)]="model.pais" name="pais" required id="pais" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary">
                <option value="">Seleccionar país</option>
                <option>Chile</option>
                <option>Argentina</option>
                <option>Perú</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="rut">RUT/NID</label>
              <input [(ngModel)]="model.rut" name="rut" id="rut" type="text" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="telefono">Teléfono</label>
              <input [(ngModel)]="model.telefono" name="telefono" id="telefono" type="tel" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>
        </section>

        <!-- Avatar -->
        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Avatar</h2>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-cover bg-center border border-slate-300 dark:border-slate-700" [ngStyle]="{ 'background-image': 'url(' + model.avatarUrl + ')' }"></div>
            <div class="flex-1 p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sube una foto</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Recomendamos una imagen de al menos 500x500px</p>
              <button type="button" (click)="simulateUpload()" class="bg-primary/20 dark:bg-primary/30 text-primary font-bold py-2 px-4 rounded text-sm hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors">Subir imagen</button>
            </div>
          </div>
        </section>

        <!-- Change Password -->
        <section>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Cambiar contraseña</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="current-password">Contraseña actual</label>
              <input [(ngModel)]="model.currentPassword" name="currentPassword" id="current-password" placeholder="Ingresa tu contraseña actual" type="password" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div></div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="new-password">Nueva contraseña</label>
              <input [(ngModel)]="model.newPassword" name="newPassword" id="new-password" placeholder="Ingresa tu nueva contraseña" type="password" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="confirm-password">Confirmar nueva contraseña</label>
              <input [(ngModel)]="model.confirmPassword" name="confirmPassword" id="confirm-password" placeholder="Confirma tu nueva contraseña" type="password" class="w-full bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-700 rounded h-10 px-3 text-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>
        </section>

        <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="submit" class="bg-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:opacity-90 transition-opacity">Guardar cambios</button>
        </div>
      </form>
    </div>
  </main>
  `
})
export class ProfileComponent {
  model: ProfileForm = {
    nombre: 'Juan',
    apellido: 'Pérez',
    pais: '',
    rut: '',
    telefono: '',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  alertService = inject(AlertService);

  simulateUpload() {
    // Simulación rápida: cambiar avatar a otro random
    this.model.avatarUrl = 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random()*70);
    this.alertService.success('Avatar actualizado (simulado).');
  }

  save() {
    // Validaciones básicas
    if (this.model.newPassword && this.model.newPassword !== this.model.confirmPassword) {
      this.alertService.error('Las contraseñas no coinciden');
      return;
    }
    if (this.model.telefono && !/^\+?[0-9\s-]{7,15}$/.test(this.model.telefono)) {
      this.alertService.error('Teléfono inválido (usar solo dígitos, espacios, guiones y opcional +)');
      return;
    }
    if (this.model.rut && !this.validateRut(this.model.rut)) {
      this.alertService.error('RUT inválido');
      return;
    }
    // Simulación de guardado
    this.alertService.success('Perfil guardado correctamente');
    this.model.currentPassword = '';
    this.model.newPassword = '';
    this.model.confirmPassword = '';
  }

  // Validación simple de RUT chileno: formato base 99999999-K y dígito verificador
  validateRut(raw: string): boolean {
    const cleaned = raw.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(cleaned)) return false;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    let sum = 0; let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const mod = 11 - (sum % 11);
    const computed = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);
    return computed === dv;
  }
}
