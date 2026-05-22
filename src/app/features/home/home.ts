import {Component, inject} from '@angular/core';
import {AuthService} from '../../shared/services/auth';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
  MatButtonModule,
  MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly authService = inject(AuthService);
}
