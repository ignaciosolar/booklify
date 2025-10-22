import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-panel-home',
  template: `
    <div class="p-4 md:p-6">
      <h1 class="text-2xl font-semibold">Bienvenido al panel</h1>
      <p class="mt-2 text-muted-light">Selecciona una opción del menú para empezar.</p>
    </div>
  `
})
export class PanelHomeComponent {}
