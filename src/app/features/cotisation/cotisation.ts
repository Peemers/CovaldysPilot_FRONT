import {Component, inject, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../shared/services/auth';
import {UserService} from '../../shared/services/user';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cotisation',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './cotisation.html',
  styleUrl: './cotisation.scss',
})
export class Cotisation {readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  isLoading = signal(false);

  pay(): void {
    if (!window.confirm('Confirmer le paiement simulé de 10€ ?')) return;

    this.isLoading.set(true);
    this.userService.payCotisation().subscribe({
      next: () => {
        this.isLoading.set(false);
        // Met à jour le signal immédiatement → badge "Effectif" sans F5 !
        this.authService.updateMembershipStatus(true);
        this.snackBar.open('🎉 Cotisation payée ! Vous êtes maintenant membre effectif !', 'Fermer', {
          duration: 5000,
          panelClass: ['snackbar-success']
        });
        void this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message ?? 'Erreur lors du paiement.', 'Fermer', {duration: 4000});
      }
    });
  }}
