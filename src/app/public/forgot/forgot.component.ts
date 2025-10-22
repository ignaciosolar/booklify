import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot',
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <main class="flex-grow">
        <div class="mx-auto max-w-md px-4 py-12 sm:py-16">
          <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-subtle-dark rounded-xl shadow-lg">
            <div class="text-center">
              <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">¿Olvidaste tu contraseña?</h2>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.</p>
            </div>
            <form class="mt-6 space-y-6" (ngSubmit)="onSubmit()" #f="ngForm">
              <div class="rounded-lg shadow-sm">
                <div>
                  <label class="sr-only" for="email-address">Correo electrónico</label>
                  <input id="email-address" name="email" type="email" autocomplete="email" required placeholder="Correo electrónico" [(ngModel)]="email"
                    class="appearance-none relative block w-full px-3 py-4 border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              </div>
              <div>
                <button type="submit" [disabled]="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600">
                  <span *ngIf="!loading">Enviar instrucciones</span>
                  <span *ngIf="loading">Enviando...</span>
                </button>
              </div>
            </form>
            <div class="text-center">
              <p class="text-sm text-slate-600 dark:text-slate-400"><a (click)="goLogin()" class="font-medium text-sky-600 hover:text-sky-500" href="#">Volver a Iniciar sesión</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class ForgotComponent {
  email = '';
  loading = false;
  constructor(private router: Router) {}
  onSubmit() {
    if (!this.email) return;
    this.loading = true;
    // simulate send
    setTimeout(() => {
      this.loading = false;
      // navigate back to login with a query param (optional)
      this.router.navigate(['/login'], { queryParams: { sent: '1' } });
    }, 800);
  }
  goLogin() { this.router.navigate(['/login']); }
}
