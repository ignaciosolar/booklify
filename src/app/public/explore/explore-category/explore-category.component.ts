// src/app/public/explore/explore-category/explore-category.component.ts
import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// IMPORTS a shared components (ojo con la ruta relativa)
import { HeaderComponent } from '../../../shared/header/header.component';
import { BusinessCardComponent, BizCard } from '../../../shared/business-card/business-card.component';
import { CategoryService } from '../../../services/category.service';

type CategoryKey = string; // ahora admite slugs devueltos por la API

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BusinessCardComponent],
  templateUrl: './explore-category.component.html',
})
export class ExploreCategoryComponent {
  // ======= Estado básico =======
  city = 'San Francisco';
  titleMap: Record<CategoryKey, string> = {};

  // route state (señales)
  category = signal<CategoryKey>('unas');
  q = signal<string>('');
  selectedCountry = signal<string>(''); // '' = Todos
  selectedRegion = signal<string>('');
  selectedCommune = signal<string>('');
  pageIndex = signal<number>(0);
  pageSize = 10;

  // combos (puedes reemplazar por datos reales de tu backend)
  countries = signal<string[]>(['Chile', 'EE.UU.', 'México']);
  regions = signal<string[]>(['Región Metropolitana', 'Valparaíso', 'Biobío']);
  communes = signal<string[]>(['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa']);

  // ======= Datos (mock por categoría) =======
  private data: Record<CategoryKey, BizCard[]> = {
    barberias: [
      { name: 'Barber Pro', slug: 'barber-pro',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8, reviews: 220, distanceKm: 1.2 },
      { name: 'Old School Barbers', slug: 'old-school-barbers',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7, reviews: 180, distanceKm: 3.4 },
      // ... agrega más si quieres
    ],
    unas: [
      { name: 'Nail Studio Glamour', slug: 'nail-studio-glamour',
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e61221a06?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8, reviews: 120, distanceKm: 1.9 },
      { name: 'Elegant Nails & Spa', slug: 'elegant-nails-spa',
        image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9, reviews: 150, distanceKm: 4.0 },
      { name: 'The Nail Lounge', slug: 'the-nail-lounge',
        image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7, reviews: 90, distanceKm: 5.0 },
      { name: 'Polished Perfection', slug: 'polished-perfection',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6, reviews: 110, distanceKm: 2.9 },
      { name: 'Chic Nail Boutique', slug: 'chic-nail-boutique',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9, reviews: 130, distanceKm: 3.5 },
      { name: 'Urban Nail Retreat', slug: 'urban-nail-retreat',
        image: 'https://images.unsplash.com/photo-1509043759401-136742328bb3?auto=format&fit=crop&w=1000&q=80',
        rating: 4.5, reviews: 100, distanceKm: 4.7 },
    ],
    estetica: [
      { name: 'DermaClinic', slug: 'dermaclinic',
        image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7, reviews: 90, distanceKm: 3.1 },
    ],
    peluquerias: [
      { name: 'Style Hair', slug: 'style-hair',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9, reviews: 180, distanceKm: 2.3 },
    ],
  };

  // ======= Derivados / Computados =======
  // Lista base según categoría
  private baseList = computed<BizCard[]>(() => this.data[this.category()] || []);

  // Filtro por búsqueda y combos (aquí solo demostrativo; adapta la condición a tus datos reales)
  private filtered = computed<BizCard[]>(() => {
    const q = this.q().toLowerCase();
    const country = this.selectedCountry();
    const region = this.selectedRegion();
    const commune = this.selectedCommune();

    return this.baseList().filter(item => {
      const matchesQ = !q || item.name.toLowerCase().includes(q);
      const matchesCountry = !country || true; // pon tu lógica real según el modelo
      const matchesRegion = !region || true;   // idem
      const matchesCommune = !commune || true; // idem
      return matchesQ && matchesCountry && matchesRegion && matchesCommune;
    });
  });

  // Paginación
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize)),
  );

  items = computed<BizCard[]>(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  // ======= Ciclo de vida / Router sync =======
  constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) {
    // Lee params y query al entrar/cambiar
    this.route.paramMap.subscribe(pm => {
      const c = (pm.get('category') || 'unas') as CategoryKey;
      this.category.set(c);
      this.pageIndex.set(0); // reset página al cambiar categoría
    });

    this.route.queryParamMap.subscribe(qm => {
      this.q.set(qm.get('q') || '');
      this.selectedCountry.set(qm.get('country') || '');
      this.selectedRegion.set(qm.get('region') || '');
      this.selectedCommune.set(qm.get('commune') || '');
      const p = Number(qm.get('page') || 1);
      this.pageIndex.set(isNaN(p) || p < 1 ? 0 : p - 1);
    });

    // Opcional: si pageIndex se va fuera de rango al filtrar, corrígelo
    effect(() => {
      const pages = this.totalPages();
      if (this.pageIndex() >= pages) {
        this.pageIndex.set(pages - 1);
        this.pushQuery({ page: String(pages) });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // Cargar títulos dinámicos usando CategoryService
    this.categoryService.getCategories().subscribe({
      next: (list) => {
        if (Array.isArray(list)) {
          for (const c of list) {
            this.titleMap[c.slug] = c.name;
          }
        }
      },
      error: () => {
        // fallbacks ya están definidos en los templates/data mock
      }
    });
  }

  // ======= Handlers (actualizan queryParams) =======
  onLocalSearch(q: string) {
    this.pageIndex.set(0);
    this.pushQuery({ q: q.trim() || null, page: '1' });
  }

  onCountryChange(v: string) {
    this.selectedCountry.set(v);
    this.selectedRegion.set('');   // reset dependientes
    this.selectedCommune.set('');
    this.pageIndex.set(0);
    this.pushQuery({ country: v || null, region: null, commune: null, page: '1' });
  }

  onRegionChange(v: string) {
    this.selectedRegion.set(v);
    this.selectedCommune.set('');
    this.pageIndex.set(0);
    this.pushQuery({ region: v || null, commune: null, page: '1' });
  }

  onCommuneChange(v: string) {
    this.selectedCommune.set(v);
    this.pageIndex.set(0);
    this.pushQuery({ commune: v || null, page: '1' });
  }

  onPrevPage() {
    const next = Math.max(0, this.pageIndex() - 1);
    this.pageIndex.set(next);
    this.pushQuery({ page: String(next + 1) });
  }

  onNextPage() {
    const next = Math.min(this.totalPages() - 1, this.pageIndex() + 1);
    this.pageIndex.set(next);
    this.pushQuery({ page: String(next + 1) });
  }

  // ======= Utilidad: actualizar query conservando el resto =======
  private pushQuery(patch: Record<string, string | null>) {
    const current = { ...this.route.snapshot.queryParams };
    for (const k of Object.keys(patch)) {
      const v = patch[k];
      if (v === null || v === '') delete current[k];
      else current[k] = v;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: current,
      queryParamsHandling: '', // usamos los actuales + patch
      replaceUrl: true,
    });
  }
}
