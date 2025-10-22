import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StoreRow {
  id: string;
  name: string;
  address: string;
  city: string;
  country?: string;
  photo_url?: string;
}

@Component({
  standalone: true,
  selector: 'app-stores',
  imports: [CommonModule, FormsModule],
  template: `
<main class="flex-1 p-8 overflow-y-auto">
  <div class="max-w-7xl mx-auto">
    <!-- PageHeading -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
      <p class="text-[#0d171b] dark:text-white text-4xl font-black tracking-tight">Administrar Sucursales</p>
      <!-- SingleButton -->
      <button (click)="showForm = true" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white gap-2 text-base font-bold">
        <span class="material-symbols-outlined">add</span>
        <span class="truncate">Agregar Nueva Sucursal</span>
      </button>
    </div>

    <!-- Table -->
    <div class="px-4 py-3 @container">
      <div class="overflow-hidden rounded-lg border border-[#cfdfe7] dark:border-white/10 bg-white dark:bg-background-dark/50">
        <table class="min-w-full">
          <thead class="bg-background-light dark:bg-white/5">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-[#0d171b] dark:text-gray-300 uppercase tracking-wider" scope="col">Foto</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-[#0d171b] dark:text-gray-300 uppercase tracking-wider" scope="col">Nombre</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-[#0d171b] dark:text-gray-300 uppercase tracking-wider" scope="col">Dirección</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-[#0d171b] dark:text-gray-300 uppercase tracking-wider" scope="col">Ciudad</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-[#4c809a] dark:text-gray-400 uppercase tracking-wider" scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#cfdfe7] dark:divide-white/10">
            <tr *ngFor="let s of stores">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0d171b] dark:text-white">
                <img *ngIf="s.photo_url; else noThumb" [src]="s.photo_url" alt="{{s.name}}" class="h-12 w-12 rounded-md object-cover" />
                <ng-template #noThumb>
                  <div class="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">No foto</div>
                </ng-template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0d171b] dark:text-white">{{ s.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4c809a] dark:text-gray-400">{{ s.address }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4c809a] dark:text-gray-400">{{ s.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="editStore(s)" class="text-primary hover:text-primary/80 mr-3">Editar</button>
                <button (click)="deleteStore(s.id)" class="text-red-600 hover:text-red-800">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="stores.length === 0">
              <td colspan="4" class="text-center py-10">
                <p class="text-[#4c809a] dark:text-gray-400 mb-4">Aún no has agregado ninguna sucursal.</p>
                <button (click)="showForm = true" class="flex mx-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white gap-2 text-base font-bold">
                  <span class="material-symbols-outlined">add</span>
                  <span class="truncate">Agregar Primera Sucursal</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Creation Form Section -->
    <div class="mt-12" *ngIf="showForm">
      <div class="flex flex-wrap justify-between gap-3 p-4 border-b border-[#cfdfe7] dark:border-white/10 mb-6">
        <p class="text-[#0d171b] dark:text-white tracking-light text-[32px] font-bold leading-tight">{{ editing ? 'Editar Sucursal' : 'Crear Nueva Sucursal' }}</p>
      </div>

      <div class="bg-white dark:bg-background-dark/50 p-6 rounded-lg shadow-sm">
        <form (ngSubmit)="saveStore()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-[#0d171b] dark:text-gray-300" for="nombre">Nombre de la sucursal</label>
            <input [(ngModel)]="form.name" name="name" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white" id="nombre" placeholder="Ej: Cafetería Espresso Lab" type="text"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#0d171b] dark:text-gray-300" for="direccion">Dirección</label>
            <input [(ngModel)]="form.address" name="address" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white" id="direccion" placeholder="Ej: Diagonal Sur 900" type="text"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#0d171b] dark:text-gray-300" for="ciudad">Ciudad</label>
            <input [(ngModel)]="form.city" name="city" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white" id="ciudad" placeholder="Ej: Ñuñoa" type="text"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#0d171b] dark:text-gray-300" for="pais">País</label>
            <input [(ngModel)]="form.country" name="country" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-background-dark text-[#0d171b] dark:text-white" id="pais" placeholder="Ej: Chile" type="text"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#0d171b] dark:text-gray-300" for="foto">Foto de la sucursal</label>
            <input (change)="onFileChange($event)" class="mt-1 block w-full" id="foto" type="file" accept="image/*" />
          </div>
          <div class="flex justify-end gap-4 pt-4">
            <button type="button" (click)="cancelForm()" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Cancelar
            </button>
            <button class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" type="submit">
              Guardar Sucursal
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</main>
  `
})
export class StoresComponent {
  stores: StoreRow[] = [
    { id: 'store_1', name: 'Cafetería Espresso Lab', address: 'Diagonal Sur 900', city: 'Ñuñoa', country: 'Chile', photo_url: '' }
  ];

  showForm = false;
  editing = false;
  form: Partial<StoreRow> = {};
  editingId: string | null = null;

  saveStore() {
    if (!this.form.name || !this.form.address || !this.form.city) return;
    if (this.editing && this.editingId) {
      const idx = this.stores.findIndex(s => s.id === this.editingId);
      if (idx >= 0) this.stores[idx] = { ...(this.stores[idx]), ...(this.form as StoreRow) };
    } else {
      const id = 'store_' + Math.random().toString(36).slice(2, 9);
      this.stores.push({ id, name: this.form.name as string, address: this.form.address as string, city: this.form.city as string, country: this.form.country as string, photo_url: this.form.photo_url as string });
    }
    this.cancelForm();
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.photo_url = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editStore(s: StoreRow) {
    this.editing = true;
    this.editingId = s.id;
    this.form = { ...s };
    this.showForm = true;
  }

  deleteStore(id: string) {
    this.stores = this.stores.filter(s => s.id !== id);
  }

  cancelForm() {
    this.showForm = false;
    this.editing = false;
    this.editingId = null;
    this.form = {};
  }
}
