import {Component, Input, Output, EventEmitter, signal, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconButton} from '@angular/material/button';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-sidenav-content',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatIconButton
  ],
  templateUrl: './sidenav-content.html',
  styleUrl: './sidenav-content.scss',
})
export class SidenavContent {
  @Input() expanded = signal(false);
  @Output() toggleEvent = new EventEmitter<void>();

  readonly authService = inject(AuthService);

  toggle(): void {
    this.toggleEvent.emit();
  }
}
