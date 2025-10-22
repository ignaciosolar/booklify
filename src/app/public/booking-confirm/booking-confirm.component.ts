import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './booking-confirm.component.html',
})
export class BookingConfirmComponent {
  reservaConfirmada = false;

  confirmarReserva() {
    this.reservaConfirmada = true;
  }
  goBack() {
    history.back();
  }
  datos: any = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.datos = {
        storeName: params['store'] ? this.formatStore(params['store']) : '',
        serviceName: params['service'] || '',
        proName: params['pro'] || '',
        fecha: params['start'] ? new Date(params['start']) : null,
        hora: params['start'] ? this.formatHora(params['start']) : '',
        name: params['name'] || '',
        email: params['email'] || '',
        whatsapp: params['whatsapp'] || '',
      };
    });
  }

  formatStore(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  }

  formatHora(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }
}
