import { Routes } from '@angular/router';

export const routes: Routes = [
  // Público
  {
    path: '',
    loadComponent: () =>
      import('./public/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 's/:slug',
    loadComponent: () =>
      import('./public/store-public/store-public.component').then(m => m.StorePublicComponent),
  },
  {
    path: 'booking/confirm',
    loadComponent: () =>
      import('./public/booking-confirm/booking-confirm.component').then(m => m.BookingConfirmComponent),
  },
  {
    path: 'terminos',
    loadComponent: () => import('./public/terminos.component').then(m => m.TerminosComponent),
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./public/privacidad.component').then(m => m.PrivacidadComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./public/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'restablecer',
    loadComponent: () => import('./public/forgot/forgot.component').then(m => m.ForgotComponent),
  },

  {
    path: 'verificar',
    loadComponent: () => import('./public/verify/verify.component').then(m => m.VerifyComponent),
  },
  {
    path: 'acceso-restringido',
    loadComponent: () => import('./public/restricted/restricted.component').then(m => m.RestrictedComponent),
  },
  {
    path: 'cuenta-validada',
    loadComponent: () => import('./public/validated/account-validated.component').then(m => m.AccountValidatedComponent),
  },
  { 
  path: 'explorar/:category',
  loadComponent: () =>
    import('./public/explore/explore-category/explore-category.component')
      .then(m => m.ExploreCategoryComponent),
},
  
  // Área privada (placeholder por ahora)
  {
    path: 'panel',
    loadChildren: () =>
      import('./private/private.routes').then(m => m.PRIVATE_ROUTES),
  },

  { path: '**', redirectTo: '' },
];
