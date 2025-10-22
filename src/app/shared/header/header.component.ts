import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { authService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { Observable } from 'rxjs';
import { AuthUser } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  user$: Observable<AuthUser | null> = authService.user$;
  stores = [] as any[];
  selectedStore = '';
  userEmail: string | null = null;
  avatarSrc = 'assets/default-avatar.svg';
  fullName = '';

  constructor(private router: Router, private storeService: StoreService) {
    try {
      authService.user$.subscribe(u => {
        this.userEmail = u ? u.email : null;
        this.avatarSrc = (u && u.avatar_url) ? u.avatar_url : 'assets/default-avatar.svg';
        this.fullName = u ? ((u.name || '') + (u.last_name ? ' ' + u.last_name : '')) : '';
        if (u && u.store_id) this.selectedStore = u.store_id;
      });
    } catch {}

    // load mock stores
    try {
      this.storeService.getStoresForUser().subscribe(list => this.stores = list || []);
    } catch {}
  }

  onStoreChange(id: string) {
    try { authService.updateUser({ store_id: String(id) }); } catch {}
  }

  logout() {
    try { authService.clear(); } catch {}
    this.router.navigate(['/']);
  }
}
