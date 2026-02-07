import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/admin/pages/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'clients',
                loadComponent: () =>
                    import('./features/admin/pages/clients/clients').then(m => m.Clients)
            },
            {
                path: 'insurances',
                loadComponent: () =>
                    import('./features/admin/pages/insurances/insurances').then(m => m.Insurances)
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('./features/admin/pages/users/users').then(m => m.Users)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
