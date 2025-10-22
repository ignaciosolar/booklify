import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  standalone: true,
  selector: 'app-terminos',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 text-slate-900">
      <app-header></app-header>
      <main class="max-w-2xl mx-auto p-8">
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-extrabold text-sky-700 mb-2 drop-shadow">Términos de Servicio</h1>
          <p class="text-base text-slate-500">Lee cuidadosamente antes de usar la plataforma.</p>
        </div>
        <div class="bg-white/90 rounded-xl shadow-lg p-6 border border-sky-100">
          <pre class="whitespace-pre-wrap text-slate-800 text-[1rem] leading-relaxed font-sans">{{ contenido }}</pre>
        </div>
      </main>
    </div>
  `,
  imports: [CommonModule, HeaderComponent],
})
export class TerminosComponent {
  contenido = '';

  constructor() {
    fetch('assets/terminos-de-servicio.txt')
      .then(r => r.text())
      .then(t => this.contenido = t);
  }
}
