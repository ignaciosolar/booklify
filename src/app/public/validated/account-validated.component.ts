import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  standalone: true,
  selector: 'app-account-validated',
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="flex min-h-screen flex-col items-center justify-center bg-background-light font-display text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <div class="mx-auto max-w-md px-4 py-16 sm:py-24 text-center">
        <div class="flex items-center justify-center mb-6">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <svg class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Cuenta validada</h2>
        <p class="mt-4 text-slate-600 dark:text-slate-400">Te estamos redirigiendo a la aplicación.</p>
        <div class="mt-8 flex justify-center">
          <div class="h-8 w-8 rounded-full border-4 border-slate-200 dark:border-slate-700 spinner" style="border-top-color:#0ea5e9; animation: spin 1s linear infinite"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host .spinner { border-top-color: #1193d4; animation: spin 1s linear infinite } @keyframes spin { to { transform: rotate(360deg); } }`
  ]
})
export class AccountValidatedComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    setTimeout(() => this.router.navigate(['/landing']), 5000);
  }
}
