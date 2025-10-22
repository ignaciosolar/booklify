import { Routes } from '@angular/router';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./panel/panel.component').then(m => m.PanelComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'panel'
      },
      {
        path: 'panel',
        loadComponent: () => import('./panel-home/panel-home.component').then(m => m.PanelHomeComponent)
      },
      {
        path: 'reservas',
        loadComponent: () => import('./reservas/reservas.component').then(m => m.ReservasComponent)
      }
      ,
      {
        path: 'reservas-hoy',
        loadComponent: () => import('./today/today-reservations.component').then(m => m.TodayReservationsComponent)
      }
      ,
      {
        path: 'servicios',
        children: [
          {
            path: '',
            loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent)
          },
          {
            path: 'editar',
            loadComponent: () => import('./services/edit-service.component').then(m => m.EditServiceComponent)
          },
          {
            path: 'crear',
            loadComponent: () => import('./services/create-service.component').then(m => m.CreateServiceComponent)
          }
        ]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      }
      ,
      {
        path: 'stores',
        loadComponent: () => import('./stores/stores.component').then(m => m.StoresComponent)
      }
      ,
      {
        path: 'perfil',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      }
      ,
      {
        path: 'horarios',
        loadComponent: () => import('./schedules/schedules.component').then(m => m.SchedulesComponent)
      }
      ,
      {
        path: 'bloqueos',
        children: [
          { path: '', loadComponent: () => import('./blocks/blocks.component').then(m => m.BlocksComponent) },
          { path: 'crear', loadComponent: () => import('./blocks/create-block.component').then(m => m.CreateBlockComponent) },
          { path: 'editar/:id', loadComponent: () => import('./blocks/create-block.component').then(m => m.CreateBlockComponent) } // reuse form
        ]
      }
    ]
  },
  // Más rutas se agregarán aquí
];
