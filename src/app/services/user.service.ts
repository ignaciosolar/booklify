import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserCreateDto {
  id?: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  country?: string;
  national_id?: string;
  avatar_url?: string;
  password_hash: string;
  status?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private endpoint = 'https://www.booklifyapi.cl/api/app_user';

  createUser(payload: UserCreateDto): Observable<any> {
    return this.http.post<any>(this.endpoint, payload);
  }

  getAllUsers() {
    return this.http.get<any[]>(this.endpoint);
  }

  confirmUser(email: string, verificationCode: string) {
    const url = `${this.endpoint}/confirm`;
    const body = { email, verificationCode };
    console.debug('[UserService] confirmUser body:', body);
    return this.http.post<any>(url, body);
  }
}
