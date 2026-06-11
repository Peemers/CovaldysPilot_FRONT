import {Component, inject, Input, signal} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink, Router, NavigationEnd, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() sidenav!: MatSidenav;

  readonly authService = inject(AuthService);
  pageTitle = signal('Accueil');

  // Map des routes vers les titres
  private readonly routeTitles: Record<string, string> = {
    '/': 'Accueil',
    '/login': 'Connexion',
    '/register': 'Inscription',
    '/articles': 'Articles',
    '/contact': 'Contact',
    '/admin': 'Dashboard Administrateur',
    '/admin/evenements': 'Gestion des événements',
    '/admin/membres': 'Gestion des membres',
    '/admin/articles': 'Gestion des articles',
    '/events': 'Événements à venir',
    '/admin/events/create' : "Créer un événement",
    '/admin/events' : "Gestion des events",
    '/events/passes/' : "Événements passés ou annulés",

  };
  constructor(private router: Router) {
    this.router.events.pipe(
     filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.pageTitle.set(this.routeTitles[event.urlAfterRedirects] ?? '');
    });
  }
}
