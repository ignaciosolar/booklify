import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type BizCard = {
  name: string;
  slug: string;
  image: string;
  rating: number;         // 0..5
  reviews: number;
  distanceKm?: number;    // opcional
};

@Component({
  standalone: true,
  selector: 'app-business-card',
  imports: [CommonModule, RouterLink],
  template: `
  <a class="group flex cursor-pointer flex-col gap-3" [routerLink]="['/s', data.slug]">
    <div class="relative w-full overflow-hidden rounded-xl bg-slate-200">
      <img [src]="data.image" [alt]="data.name"
           class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div>
      <p class="font-bold text-slate-900">{{ data.name }}</p>
      <p class="text-sm text-slate-500">
        {{ data.rating | number:'1.1-1' }} ({{ data.reviews }} reseñas)
        <ng-container *ngIf="data.distanceKm !== undefined"> · {{ data.distanceKm }} km</ng-container>
      </p>
    </div>
  </a>
  `,
})
export class BusinessCardComponent {
  @Input({ required: true }) data!: BizCard;
}
