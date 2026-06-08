import {Component, inject, OnInit, signal} from '@angular/core';
import {EventService} from "../../shared/services/event";
import {SignInService} from "../../shared/services/sign-in";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {EventResponseDto, EventStatus} from "../../shared/models/event.models";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {RouterLink} from "@angular/router";
import {DatePipe, SlicePipe} from "@angular/common";
import {AuthService} from '../../shared/services/auth';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-events',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    DatePipe, SlicePipe,],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly signInService = inject(SignInService);
  private readonly snackBar = inject(MatSnackBar)
  readonly authService = inject(AuthService);

  events = signal<EventResponseDto[]>([])
  isLoading = signal(true)
  errorMessage = signal<string | null>(null);

  readonly EventStatus = EventStatus;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading.set(true)
    this.eventService.getAll().subscribe({
      next: (events: EventResponseDto[]) => {
        this.events.set(events);
        this.isLoading.set(false)
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement de la page');
        this.isLoading.set(false);
      }
    });
  }

  register(eventId: string): void {
    this.signInService.register(eventId).subscribe({
      next: () => {
        this.snackBar.open('Inscription confirmée !', 'Fermer', {duration: 3000});
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de l\'inscription.', 'Fermer', {duration: 4000});
      }
    });
  }

  unregister(signInId: string): void {
    this.signInService.unregister(signInId).subscribe({
      next: () => {
        this.snackBar.open('Désinscription confirmée !', 'Fermer', {duration: 3000});
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de la désinscription.', 'Fermer', {duration: 4000});
      }
    });
  }

  getStatusLabel(status: EventStatus): string {
    const labels: Record<EventStatus, string> = {
      [EventStatus.EnAttente]: 'Non débuté',
      [EventStatus.EnCours]: 'En cours',
      [EventStatus.Termine]: 'Terminé',
      [EventStatus.Annule]: 'Annulé'
    };
    return labels[status];
  }

  getStatusColor(status: EventStatus): string {
    const colors: Record<EventStatus, string> = {
      [EventStatus.EnAttente]: 'primary',
      [EventStatus.EnCours]: 'accent',
      [EventStatus.Termine]: '',
      [EventStatus.Annule]: 'warn'
    };
    return colors[status];
  }
}
