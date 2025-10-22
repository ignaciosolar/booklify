import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

interface ServicePayload {
  name?: string;
  price?: string | number;
  duration?: string | number;
  status?: string;
}

@Component({
  standalone: true,
  selector: 'app-edit-service',
  imports: [CommonModule, RouterModule],
  template: `
  <main class="flex-grow">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col gap-8">
        <div>
          <a class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" href (click)="goBack($event)">
            <span class="material-symbols-outlined">arrow_back</span> Volver a Servicios
          </a>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Formulario de Edición de Servicio</h2>
        </div>
        <form class="bg-white dark:bg-background-dark/50 shadow-lg rounded-xl overflow-hidden">
          <div class="p-6 sm:p-8 space-y-8">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div class="relative group">
                  <div class="h-24 w-24 rounded-lg bg-cover bg-center" style='background-image: url("https://i.pravatar.cc/300")'></div>
                  <label class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" for="service-photo">
                    <span class="material-symbols-outlined text-white text-3xl">photo_camera</span>
                    <input class="sr-only" id="service-photo" type="file" />
                  </label>
                </div>
              </div>
              <div class="flex-grow space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="service-name">Nombre del servicio</label>
                  <input class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm" id="service-name" name="service-name" required type="text" [value]="serviceName" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="base-price">Precio base</label>
                <div class="relative mt-1 rounded-md shadow-sm">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span class="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                  </div>
                  <input class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-7 pr-12 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm" id="base-price" min="0" name="base-price" placeholder="0.00" required step="0.01" type="number" [value]="basePrice" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="currency">Moneda</label>
                <select class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm" id="currency" name="currency">
                  <option>EUR</option>
                  <option>USD</option>
                  <option>GBP</option>
                  <option>MXN</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="base-duration">Duración base</label>
                <div class="relative mt-1 rounded-md shadow-sm">
                  <input class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-20 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm" id="base-duration" min="1" name="base-duration" placeholder="0" required type="number" [value]="baseDuration" />
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-gray-500 dark:text-gray-400 sm:text-sm">minutos</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado del servicio</label>
                <div class="mt-2 flex items-center gap-4">
                  <div class="flex items-center">
                    <input checked class="h-4 w-4 border-gray-300 text-primary focus:ring-primary" id="status-active" name="status" type="radio" />
                    <label class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300" for="status-active">Activo</label>
                  </div>
                  <div class="flex items-center">
                    <input class="h-4 w-4 border-gray-300 text-primary focus:ring-primary" id="status-inactive" name="status" type="radio" />
                    <label class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300" for="status-inactive">Inactivo</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Disponibilidad por Sucursal</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gestiona en qué sucursales está disponible este servicio.</p>
              <div class="mt-6 space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-200">Sucursal Centro</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Calle Mayor, 12, Madrid</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <button class="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" type="button">
                      <span class="material-symbols-outlined">schedule</span>
                    </button>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input checked class="sr-only peer" type="checkbox" value="" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 sr-only">Activo</span>
                    </label>
                  </div>
                </div>
                <!-- other branches omitted for brevity -->
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 sm:px-8 flex justify-end gap-4">
            <button class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark" type="button">Cancelar</button>
            <button class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark" type="submit">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  </main>
  `
})
export class EditServiceComponent {
  serviceName = 'Manicura';
  basePrice: number | string = 25;
  baseDuration: number | string = 45;
  status = 'Activo';

  constructor(private router: Router, private route: ActivatedRoute) {
    // Read the service passed via navigation state (history.state)
    const s = (history && (history.state as any) && (history.state as any).service) as ServicePayload | undefined;
    if (s) {
      if (s.name) this.serviceName = s.name;
      if (s.price !== undefined) this.basePrice = s.price;
      if (s.duration !== undefined) this.baseDuration = s.duration;
      if (s.status) this.status = s.status;
    } else {
      // Acceso directo sin estado -> regresar al listado de servicios
      setTimeout(() => this.safeBack(), 0);
    }
  }

  goBack(event: Event) {
    event.preventDefault();
    this.safeBack();
  }

  private safeBack() {
    // Try relative navigation one level up (from /servicios/editar -> /servicios)
    try {
      this.router.navigate(['..'], { relativeTo: this.route }).catch(() => {
        this.router.navigate(['/servicios']);
      });
    } catch {
      this.router.navigate(['/servicios']);
    }
  }
}
