import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  expiresIn?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private http = inject(HttpClient);
  private endpoint = 'https://www.booklifyapi.cl/api/app_user/login';

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    console.debug('[ApiAuthService] POST login body:', { email, password: '****' });
    return this.http.post<LoginResponse>(this.endpoint, body);
  }
}
