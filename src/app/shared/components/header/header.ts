import {Component, inject, Input, signal} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink, Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButton,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() sidenav!: MatSidenav;

  readonly  authService = inject(AuthService);
  pageTitle = signal('Accueil');

  // Map des routes vers les titres
  private readonly routeTitles: Record<string, string> = {
    '/': 'Accueil',
    '/login': 'Connexion',
    '/register': 'Inscription',
    '/evenements': 'Événements à venir',
    '/evenements/passes': 'Événements passés',
    '/articles': 'Articles',
    '/contact': 'Contact',
    '/admin': 'Dashboard Admin',
    '/admin/evenements': 'Gestion des événements',
    '/admin/membres': 'Gestion des membres',
    '/admin/articles': 'Gestion des articles',
  };

  constructor(private router: Router) {
    this.router.events.pipe(
     filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageTitle.set(this.routeTitles[event.urlAfterRedirects] ?? '');
    });
  }
}
