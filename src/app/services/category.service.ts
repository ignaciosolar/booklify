import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreCategory {
  code: string;
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private endpoint = 'https://www.booklifyapi.cl/api/store_category_lkp';

  getCategories(): Observable<StoreCategory[]> {
    return this.http.get<StoreCategory[]>(this.endpoint);
  }
}
