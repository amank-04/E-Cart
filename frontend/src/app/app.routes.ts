import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component') },
  { path: 'home', loadComponent: () => import('./pages/home/home.component') },
  {
    path: 'search/:term',
    loadComponent: () => import('./pages/search/search.component'),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.component'),
  },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component') },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component'),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./pages/forget-password/forget-password.component'),
  },
  {
    path: 'reset/:token',
    loadComponent: () => import('./pages/reset/reset.component'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component'),
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./pages/success/success.component'),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component'),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/admin-home/admin-home.component'),
      },
      {
        path: 'add-product',
        loadComponent: () =>
          import('./admin/admin-add-product/admin-add-product.component'),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/admin-customers/admin-customers.component'),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/admin-orders/admin-orders.component'),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/admin-products/admin-products.component'),
      },
      {
        path: 'edit-product/:id',
        loadComponent: () =>
          import('./admin/edit-product/edit-product.component'),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
  },
];
