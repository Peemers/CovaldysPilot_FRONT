import {Component, inject, OnInit, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {SignInService} from '../../shared/services/sign-in';
import {SignInResponseDto} from '../../shared/models/sign-in.models';
import {UserResponseDto} from '../../shared/models/user.models';
import {UserService} from '../../shared/services/user';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly signInService = inject(SignInService);

  user = signal<UserResponseDto | null>(null);
  signIns = signal<SignInResponseDto[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProfile();
    this.loadSignIns();
  }

  loadProfile(): void {
    this.userService.getMe().subscribe({
      next: (user: UserResponseDto) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement du profil.');
        this.isLoading.set(false);
      }
    });
  }

  loadSignIns(): void {
    this.signInService.getMySignIn().subscribe({
      next: (signIns: SignInResponseDto[]) => {
        this.signIns.set(signIns);
      }
    });
  }

  getEventStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'EnAttente':
        return '⏳ Non débuté';
      case 'EnCours':
        return '▶️ En cours';
      case 'Termine':
        return '✅ Terminé';
      case 'Annule':
        return '❌ Annulé';
      default:
        return '';
    }
  }

  protected readonly Event = Event;
}
