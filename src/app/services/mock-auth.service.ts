import { Injectable } from '@angular/core';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsapp: string;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  // Simulate registering a user. Returns a promise that resolves with whether verification is needed.
  register(payload: RegisterPayload): Promise<{ needsVerification: boolean }> {
    return new Promise((res) => {
      // simulate network latency
      setTimeout(() => {
        // For admins we require verification; for non-admins we simulate 'invitation required' flow
        res({ needsVerification: !!payload.isAdmin });
      }, 700);
    });
  }

  // Simulate verifying a code. Use '000000' to force failure, anything else of length 6 succeeds.
  verifyCode(email: string, code: string): Promise<{ success: boolean }> {
    return new Promise((res) => {
      setTimeout(() => {
        if (!code || code.length !== 6) return res({ success: false });
        if (code === '000000') return res({ success: false });
        return res({ success: true });
      }, 700);
    });
  }
}
