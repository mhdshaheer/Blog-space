import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'BlogSpace - Home'
  },
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
    path: 'blogs/:id',
    loadComponent: () => import('./features/blogs/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
    title: 'Read Article'
  },
  { path: '**', redirectTo: '' }
];
