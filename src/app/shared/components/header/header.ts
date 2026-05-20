import {Component, Input, signal} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButton,
    RouterLink,
    MatIconButton,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() sidenav!: MatSidenav;

  // Temporaire — sera remplacé par AuthService
  isLoggedIn = signal(false);
}
