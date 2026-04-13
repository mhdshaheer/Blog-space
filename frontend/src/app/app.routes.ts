import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { 
        path: '', 
        component: HomeComponent,
        title: 'BlogSpace - Home'
      },
      {
        path: 'create-blog',
        loadComponent: () => import('./features/blogs/blog-form/blog-form.component').then(m => m.BlogFormComponent),
        canActivate: [authGuard],
        title: 'Create New Post'
      },
      {
        path: 'edit-blog/:id',
        loadComponent: () => import('./features/blogs/blog-form/blog-form.component').then(m => m.BlogFormComponent),
        canActivate: [authGuard],
        title: 'Edit Post'
      },
      {
        path: 'my-blogs',
        loadComponent: () => import('./features/blogs/my-blogs/my-blogs.component').then(m => m.MyBlogsComponent),
        canActivate: [authGuard],
        title: 'My Dashboard'
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/blogs/favorite-blogs/favorite-blogs.component').then(m => m.FavoriteBlogsComponent),
        canActivate: [authGuard],
        title: 'My Favorites'
      },
      {
        path: 'blogs/:id',
        loadComponent: () => import('./features/blogs/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
        title: 'Read Article'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./core/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Sign In'
      },
      { 
        path: 'register', 
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Sign Up'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Recover Access'
      }
    ]
  },
  {
    path: '500',
    loadComponent: () => import('./features/error/server-error/server-error.component').then(m => m.ServerErrorComponent),
        title: 'Server Error'
  },
  { 
    path: '404', 
    loadComponent: () => import('./features/error/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  },
  { path: '**', redirectTo: '404' }
];
