import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
// removed MockLoginService fallback: use real API only
import { ApiAuthService } from '../../services/api-auth.service';
import { Router } from '@angular/router';
import { authService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HeaderComponent, RouterLink],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <main class="flex-grow">
  <div class="mx-auto max-w-md px-4 py-8 sm:py-12">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Inicia sesión en tu cuenta</h2>
            <p class="mt-4 text-slate-600 dark:text-slate-400">Bienvenido de nuevo, te hemos echado de menos.</p>
          </div>

          <form class="mt-6 space-y-6" (ngSubmit)="onSubmit()" #f="ngForm">
            <div class="rounded-lg bg-white dark:bg-slate-900/50 p-6 shadow-sm">
              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-900 dark:text-slate-300" for="email-address">Correo electrónico</label>
                <div class="mt-2">
                  <input id="email-address" name="email" type="email" autocomplete="email" required placeholder="Correo electrónico" [(ngModel)]="email"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-900 dark:text-slate-300" for="password">Contraseña</label>
                <div class="mt-2">
                  <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Contraseña" [(ngModel)]="password"
                    class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end">
              <div class="text-sm">
                <a class="font-medium text-sky-600 hover:text-sky-500" routerLink="/restablecer">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            <div *ngIf="error" class="text-red-600 text-sm mt-2">{{ error }}</div>
            <div class="pt-6">
              <button type="submit" [disabled]="loading" class="flex w-full justify-center rounded-lg bg-sky-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50">
                <span *ngIf="!loading">Iniciar sesión</span>
                <span *ngIf="loading" class="flex items-center gap-2"><svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> Cargando...</span>
              </button>
            </div>
          </form>

          <div class="text-center text-sm mt-6">
            <p class="text-slate-600 dark:text-slate-400">¿Eres nuevo? <a class="font-medium text-sky-600 hover:text-sky-500" routerLink="/registro">Crea tu tienda</a></p>
            <p class="mt-2 text-xs text-slate-500 dark:text-slate-500">Si quieres trabajar en una tienda existente debes recibir una invitación.</p>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class LoginComponent {
  loading = false;
  error = '';
  email = '';
  password = '';
  constructor(private router: Router, private apiAuth: ApiAuthService, private userService: UserService) {}

  onSubmit() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Completa los campos';
      return;
    }
    const payload = { email: this.email, password: this.password };
    console.debug('[LOGIN] request payload:', payload);
    this.loading = true;
    this.apiAuth.login(this.email, this.password).subscribe({
      next: (resp) => {
        this.loading = false;
        console.debug('[LOGIN] response:', resp);
        if (resp?.token) {
          authService.setUser({ email: this.email, token: resp.token });
          console.log('[LOGIN] success, token stored');
          // Enriquecer perfil desde GET /api/app_user filtrando por email
          this.userService.getAllUsers().subscribe({
            next: (list) => {
              const me = (list || []).find(u => u.email && u.email.toLowerCase() === this.email.toLowerCase());
              if (me) {
                // Prefer explicit name + last_name if available, fall back to full_name or single name
                const first = me.name || me.full_name || '';
                const last = me.last_name || '';
                authService.updateUser({ name: first, last_name: last, avatar_url: me.avatar_url || '' });
              }
            },
            error: (err) => console.warn('[LOGIN] could not enrich profile', err)
          });
          this.router.navigate(['/panel']);
        } else {
          this.error = 'Respuesta inválida del servidor';
          console.error('[LOGIN] invalid response body', resp);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('[LOGIN] API error:', err);
        // show user-friendly message
        if (err?.status === 401) this.error = 'Credenciales incorrectas';
        else this.error = err?.error?.Message || err?.error?.message || 'Error de autenticación';
      }
    });
  }
}
