import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockLoginService {
  // Simulate a login request. Resolves with a token when password === 'password'
  login(email: string, password: string): Promise<{ success: boolean; token?: string; message?: string; email?: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          resolve({ success: false, message: 'Correo inválido' });
          return;
        }
        if (password === 'password') {
          // return a fake token
          resolve({ success: true, token: 'mock-token-' + Math.random().toString(36).slice(2), email });
        } else {
          resolve({ success: false, message: 'Credenciales incorrectas' });
        }
      }, 700);
    });
  }
}
