import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface StoreItem {
  id: string;
  name: string;
  photo_url?: string;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  // Mock data for now
  private mock: StoreItem[] = [
    { id: 'store_1', name: 'Tienda Principal', photo_url: 'assets/default-store.svg' },
    { id: 'store_2', name: 'Sucursal Centro', photo_url: 'assets/default-store.svg' },
    { id: 'store_3', name: 'Sucursal Norte', photo_url: 'assets/default-store.svg' }
  ];

  constructor() {}

  getStoresForUser(): Observable<StoreItem[]> {
    // In the future this will call backend with user token
    return of(this.mock);
  }
}
