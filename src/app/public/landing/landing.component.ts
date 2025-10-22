import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { CategoryService, StoreCategory } from '../../services/category.service';

type Category = { title: string; image: string; category: string };

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  constructor(private router: Router, private catSrv: CategoryService) {}

  categories: Category[] = [];

  // imagen por defecto si la API no provee una
  private defaultImages: Record<string, string> = {
    barberia: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
    peluqueria: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    unas: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop',
    estetica: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=1200&auto=format&fit=crop',
  };

  ngOnInit(): void {
    this.catSrv.getCategories().subscribe({
      next: (list: StoreCategory[]) => {
        this.categories = list.map(s => ({
          title: s.name,
          image: this.defaultImages[s.slug] || Object.values(this.defaultImages)[0],
          category: s.slug || s.code.toLowerCase(),
        }));
      },
      error: () => {
        // fallback a las categorías locales si la llamada falla
        this.categories = [
          { title: 'Barberías', image: this.defaultImages['barberia'], category: 'barberias' },
          { title: 'Salones de Uñas', image: this.defaultImages['unas'], category: 'unas' },
          { title: 'Clínicas de Estética', image: this.defaultImages['estetica'], category: 'estetica' },
          { title: 'Peluquerías', image: this.defaultImages['peluqueria'], category: 'peluquerias' },
        ];
      }
    });
  }

  onSearchEnter(value: string) {
    const q = value.trim();
    if (q) this.router.navigate(['/explorar', 'unas'], { queryParams: { q } });
  }
}
