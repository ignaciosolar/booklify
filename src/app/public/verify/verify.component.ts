import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MockAuthService } from '../../services/mock-auth.service';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-verify',
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <main class="flex-grow">
        <div class="mx-auto max-w-md px-4 py-16 sm:py-24">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Verifica tu correo</h2>
            <p class="mt-4 text-slate-600 dark:text-slate-400">
              Le hemos enviado un código a su correo
              <span class="font-medium text-slate-800 dark:text-slate-200">{{ email }}</span>.
              Por favor, ingrese el código a continuación para validar su cuenta.
            </p>
          </div>
          <form class="mt-8 space-y-6" (submit)="validate($event)">
            <div>
              <label class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300" for="verification-code">Código de verificación</label>
              <div class="mt-2">
                <input id="verification-code" maxlength="6" placeholder="------" required type="text"
                  [(ngModel)]="code" name="code" [disabled]="loading"
                  class="block w-full rounded-lg border-0 bg-slate-200/50 py-3 text-center text-lg tracking-[0.5em] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-primary" />
              </div>
            </div>
            <div *ngIf="error" class="text-red-600 text-sm mt-2">{{ error }}</div>
            <div class="pt-6">
              <button type="submit" [disabled]="loading" class="flex w-full items-center justify-center gap-3 rounded-lg bg-sky-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-60">
                <svg *ngIf="loading" class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Validar cuenta</span>
              </button>
            </div>
            <div class="text-center text-sm">
              <a class="font-medium text-sky-600 hover:text-sky-500" (click)="resend()" href="#" [class.pointer-events-none]="loading" [class.opacity-50]="loading">¿No recibiste el código? Reenviar</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
})
export class VerifyComponent {
  email = '';
  code = '';
  error = '';
  loading = false;
  constructor(private route: ActivatedRoute, private router: Router, private auth: MockAuthService, private userService: UserService) {
    const qp = this.route.snapshot.queryParamMap;
    this.email = qp.get('email') || '';
  }

  validate(e: Event) {
    e.preventDefault();
    this.error = '';
    if (!this.code || this.code.length !== 6) {
      this.error = 'Ingresa un código de 6 dígitos';
      return;
    }
    this.loading = true;
    this.userService.confirmUser(this.email, this.code).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.Message || err?.error?.message || 'Código inválido. Intenta nuevamente.';
      }
    });
  }

  resend() {
    // Simulate resend using mock (no backend endpoint provided for resend)
    this.auth.verifyCode(this.email, '000000').then(() => {
      alert('Código reenviado (simulado)');
    });
  }
}
