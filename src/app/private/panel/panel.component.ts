import { Component, inject } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, RouterOutlet, SidebarComponent],
  template: `

  <div class="flex min-h-screen">
      <!-- Mobile menu button -->
      <div class="fixed top-20 left-4 md:hidden">
        <button 
          (click)="drawerService.toggle()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      <app-sidebar></app-sidebar>

      <!-- Main content (child routes will render here) -->
      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>

      <!-- Backdrop (mobile only) -->
      <div 
        *ngIf="drawerService.isOpen()" 
        (click)="drawerService.close()"
        class="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 md:hidden">
      </div>
    </div>
  `
})
export class PanelComponent {
  drawerService = inject(DrawerService);
}