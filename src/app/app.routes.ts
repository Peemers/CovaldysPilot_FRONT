import {Routes} from '@angular/router';
import {guestGuard} from './shared/guards/guest-guard';
import {authGuard} from "./shared/guards/auth-guard";
import {adminGuard} from './shared/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/events').then(m => m.Events)
  },
  {
    path: 'articles',
    loadComponent: () => import('./features/articles/articles').then(m => m.Articles)
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./features/article-detail/article-detail').then(m => m.ArticleDetail)
  },
  {
    path: 'admin/articles/create',
    canActivate: [adminGuard, authGuard],
    loadComponent: () => import('./features/admin/article-form/article-form').then(m => m.ArticleForm)
  },
  {
    path: 'admin/article/:id/edit',
    canActivate: [adminGuard, authGuard],
    loadComponent: () => import('./features/admin/article-form/article-form').then(m => m.ArticleForm)
  },
  // {
  //   path: 'admin/articles',
  //   canActivate: [authGuard, adminGuard],
  //   loadComponent: () => import('./features/admin/articles-management/articles-management')
  //    .then(m => m.ArticlesManagement)
  // },
  {
    path: 'events/:id',
    loadComponent: () => import('./features/event-detail/event-detail').then(m => m.EventDetail)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'admin/events',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/events-management/events-management')
     .then(m => m.EventsManagement)
  },
  {
    path: 'admin/events/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/event-form/event-form')
     .then(m => m.EventForm)
  },
  {
    path: 'admin/events/:id/edit',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/event-form/event-form')
     .then(m => m.EventForm)
  },
  {
    path: 'admin/membres',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/members-management/members-management')
     .then(m => m.MembersManagement)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
