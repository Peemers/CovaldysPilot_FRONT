import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header } from './shared/components/header/header';
import { SidenavContent } from './shared/components/sidenav-content/sidenav-content';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    Header,
    SidenavContent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  sidenavExpanded = signal(false);
  isLoggedIn = signal(true); // temporaire

  toggleSidenav(): void {
    this.sidenavExpanded.update(v => !v);
  }
}
