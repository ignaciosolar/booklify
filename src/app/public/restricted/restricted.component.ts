import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-restricted',
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <main class="flex-grow">
        <div class="mx-auto max-w-lg px-4 py-16 sm:py-24">
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
              <svg class="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Registro por Invitación</h2>
            <p class="mt-4 text-slate-600 dark:text-slate-400">
              Lamentamos decirte que si quieres crear un usuario no administrador, debes ser invitado por otro usuario administrador de la tienda para registrarte.
            </p>
          </div>
          <div class="mt-8">
            <div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">¿Qué debes hacer?</h3>
              <p class="mt-2 text-slate-600 dark:text-slate-400">
                Ponte en contacto con el administrador de la tienda a la que deseas unirte y pídele que te envíe una invitación de registro a tu correo electrónico.
              </p>
              <p class="mt-4 text-sm text-slate-500 dark:text-slate-500">
                Una vez que recibas la invitación, podrás completar tu registro fácilmente.
              </p>
            </div>
          </div>
          <div class="mt-8 text-center">
            <button (click)="goHome()" class="text-sm font-medium text-sky-600 hover:text-sky-500">Volver a la página principal</button>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class RestrictedComponent {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/']);
  }
}
