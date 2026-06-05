import {Component, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {Header} from './shared/components/header/header';
import {SidenavContent} from './shared/components/sidenav-content/sidenav-content';
import {AuthService} from './shared/services/auth';
import {SiteConfigurationService} from './shared/services/site-configuration';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {map} from 'rxjs';
import {filter} from 'rxjs/operators';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    Header,
    SidenavContent,
    MatIcon, MatIconModule, RouterLink, MatButton, MatButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly authService = inject(AuthService);
  readonly siteConfigService = inject(SiteConfigurationService);
  private readonly router = inject(Router)
  sidenavExpanded = signal(false);

  constructor() {
    this.siteConfigService.loadConfig() //au démarrage vérifie si la config est active ou non
  }

  currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects)
    ),
    {initialValue: this.router.url}
  );

  isLoginPage(): boolean {
    return this.currentUrl() === '/login';
  }

  toggleSidenav(): void {
    this.sidenavExpanded.update(v => !v);
  }
}
