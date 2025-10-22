import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { NgIf } from '@angular/common';
import { authService, AuthUser } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// StoreService removed from this component: bottom nav does not show store selector

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIf],
  template: `
  <nav aria-label="Main bottom navigation" class="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-md">
      <ul class="flex items-center justify-between py-2 px-3">
        <li class="hidden md:flex items-center gap-3">
          <img alt="avatar" class="h-8 w-8 rounded-full" [src]="(user$ | async)?.avatar_url || 'assets/default-avatar.svg'" />
          <div class="text-sm">
            <div class="font-medium">{{ ((user$ | async)?.name || '') + ((user$ | async)?.last_name ? ' ' + (user$ | async)?.last_name : '') || 'Usuario' }}</div>
          </div>
        </li>
        <li>
          <a title="Panel" routerLink="panel" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">space_dashboard</span>
          </a>
        </li>
        <li>
          <a title="Agenda" routerLink="reservas" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">calendar_month</span>
          </a>
        </li>
        <li>
          <a title="Reservas de hoy" routerLink="reservas-hoy" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">event_available</span>
          </a>
        </li>
        <li>
          <a title="Servicios" routerLink="servicios" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">cut</span>
          </a>
        </li>
        <li>
          <a title="Gestión de usuarios" routerLink="usuarios" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">groups</span>
          </a>
        </li>
        <li>
          <a title="Tiendas" routerLink="stores" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">storefront</span>
          </a>
        </li>
        
        <li>
          <a title="Mi Perfil" routerLink="perfil" routerLinkActive="text-primary scale-110" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark px-4 py-1 transition-transform duration-150">
            <span class="material-symbols-outlined">account_circle</span>
          </a>
        </li>
        <li class="hidden md:block">
          <button (click)="logout()" title="Cerrar sesión" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <span class="material-symbols-outlined">logout</span>
          </button>
        </li>
      </ul>
    </nav>
  `
})
export class SidebarComponent {
  sidebar = inject(SidebarService);
  user$: Observable<AuthUser | null> = authService.user$;

  private mql: MediaQueryList | null = null;

  constructor(private router: Router) {
    // Listen for Escape key to toggle sidebar on md+ screens
    try {
      this.mql = window.matchMedia('(min-width: 768px)');
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.mql && this.mql.matches) {
          this.sidebar.toggle();
        }
      };
      window.addEventListener('keydown', handler);
      // store reference to remove later
      (this as any)._escHandler = handler;
    } catch (e) {
      // ignore in non-browser env
    }
  }


  toggle() {
    this.sidebar.toggle();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    authService.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    try {
      const h = (this as any)._escHandler;
      if (h) window.removeEventListener('keydown', h);
    } catch {}
  }

  onStoreChange(e: Event) {
    // store selector removed in bottom nav; kept for compatibility
    const sel = (e.target as HTMLSelectElement).value;
    authService.updateUser({ store_id: sel });
  }
}
