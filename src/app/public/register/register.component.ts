import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MockAuthService } from '../../services/mock-auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <main class="flex-grow">
        <div class="mx-auto max-w-md px-4 py-16 sm:py-24">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Crea tu usuario</h2>
            <p class="mt-4 text-slate-600 dark:text-slate-400">
              Comienza creando tu cuenta personal. Estos datos se usarán para iniciar sesión.
            </p>
          </div>
          <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()" #f="ngForm">
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="first-name">Nombre</label>
                <div class="mt-2">
                  <input id="first-name" name="firstName" placeholder="Ingresa tu nombre" required type="text" [(ngModel)]="firstName"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="last-name">Apellido</label>
                <div class="mt-2">
                  <input id="last-name" name="lastName" placeholder="Ingresa tu apellido" required type="text" [(ngModel)]="lastName"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="phone-number">Número de Teléfono</label>
              <div class="mt-2">
                <div class="flex gap-2">
                  <select [(ngModel)]="whatsappCode" name="whatsappCode" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-600 focus:ring-sky-600">
                    <option value="+56">+56</option>
                    <option value="+54">+54</option>
                    <option value="+34">+34</option>
                    <option value="+1">+1</option>
                  </select>
                  <input id="phone-number" name="whatsappNumber" placeholder="Número" required type="tel" [(ngModel)]="whatsappNumber" minlength="7" maxlength="9" #phoneInput="ngModel"
                    class="w-full rounded-lg border-0 bg-slate-200/50 py-3 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
                </div>
                <div *ngIf="phoneInput.invalid && phoneInput.touched" class="text-red-600 text-xs mt-1">Ingresa un número válido (7 a 9 dígitos).</div>
              </div>
            </div>
            <div class="col-span-full">
              <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="email">Correo electrónico</label>
              <div class="mt-2">
                <input id="email" name="email" placeholder="tu@email.com" required type="email" [(ngModel)]="email" #emailInput="ngModel"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
                <div *ngIf="emailInput.invalid && emailInput.touched" class="text-red-600 text-xs mt-1">Ingresa un correo válido.</div>
              </div>
            </div>
            <div class="col-span-full grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="country">País</label>
                <div class="mt-2">
                  <input id="country" name="country" placeholder="Chile" type="text" [(ngModel)]="country"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="national-id">RUT / ID</label>
                <div class="mt-2">
                  <input id="national-id" name="nationalId" placeholder="RUT o cédula" type="text" [(ngModel)]="nationalId"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary" />
                </div>
              </div>
            </div>

            <div *ngIf="apiError" class="col-span-full">
              <div class="rounded-md bg-red-50 border border-red-100 p-3 text-red-700 text-sm">
                {{ apiError }}
              </div>
            </div>
            <div class="col-span-full">
              <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="password">Contraseña</label>
              <div class="mt-2">
                <input id="password" name="password" placeholder="Crea una contraseña segura" required type="password" [(ngModel)]="password"
                  class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
              </div>
            </div>
            <div class="flex items-center">
              <input id="admin-toggle" name="adminToggle" type="checkbox" [(ngModel)]="isAdmin"
                class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-background-dark" />
              <label class="ml-3 block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="admin-toggle">Soy admin de mi tienda</label>
            </div>
            <div class="pt-6">
              <button type="submit" [disabled]="f.invalid || whatsappNumber.length < 7" class="flex w-full justify-center rounded-lg bg-sky-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 disabled:cursor-not-allowed">Continuar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
})
export class RegisterComponent {
  loading = false;
  constructor(private router: Router, private auth: MockAuthService, private userService: UserService) {}
  // form model
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  whatsappCode = '+56';
  whatsappNumber = '';
  isAdmin = false;
  country = '';
  nationalId = '';
  apiError = '';

  // validation helpers
  get whatsappFull() {
    return this.whatsappCode && this.whatsappNumber ? `${this.whatsappCode}${this.whatsappNumber}` : '';
  }

  onSubmit() {
    // simple validation guard
    if (!this.email || !this.password || this.whatsappNumber.length < 7) return;
    // construir body según lo que el backend espera
    const body = {
      name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.whatsappFull,
  country: this.country || undefined,
  national_id: this.nationalId || undefined,
      password_hash: this.password, // NOTE: idealmente hashear en backend
      status: false,
    };

    this.loading = true;
    this.userService.createUser(body).subscribe({
      next: (resp) => {
        this.loading = false;
        // si el backend creó el usuario, navegamos a verificación
        this.router.navigate(['/verificar'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        console.warn('Error creating user on API', err);
        this.loading = false;
        // mostrar mensaje de error en la UI
        this.apiError = err?.error?.Message || err?.error?.message || err?.message || 'Error al comunicarse con el servicio. Intenta nuevamente más tarde.';
      }
    });
  }
}
