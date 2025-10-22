import { BehaviorSubject } from 'rxjs';

export interface AuthUser { email: string; token: string; name?: string; last_name?: string; avatar_url?: string; store_id?: string }

export class AuthService {
  private _user = new BehaviorSubject<AuthUser | null>(null);
  user$ = this._user.asObservable();

  constructor() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = sessionStorage.getItem('auth_user');
        if (raw) {
          try { this._user.next(JSON.parse(raw)); } catch {}
        }
      }
    } catch (e) {
      // ignore in non-browser env or if storage is blocked
    }
  }

  setUser(u: AuthUser) {
    // merge with existing to avoid losing fields when enriching later
    const prev = this._user.getValue() || {} as AuthUser;
    const merged: AuthUser = { ...prev, ...u };
    this._user.next(merged);
    try { sessionStorage.setItem('auth_user', JSON.stringify(merged)); } catch {}
  }

  updateUser(partial: Partial<AuthUser>) {
    const prev = this._user.getValue() || {} as AuthUser;
    const merged: AuthUser = { ...prev, ...partial };
    this._user.next(merged);
    try { sessionStorage.setItem('auth_user', JSON.stringify(merged)); } catch {}
  }

  // Synchronous getter for the current user value.
  getUser(): AuthUser | null {
    return this._user.getValue();
  }

  clear() {
    this._user.next(null);
    try { sessionStorage.removeItem('auth_user'); } catch {}
  }
}

// Export a simple singleton instance so standalone components can import it directly.
export const authService = new AuthService();
