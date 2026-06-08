import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { EventService } from '../../../shared/services/event';
import { EventResponseDto, EventStatus } from '../../../shared/models/event.models';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-events-management',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe,
    MatTooltip,
  ],
  templateUrl: './events-management.html',
  styleUrl: './events-management.scss',
})
export class EventsManagement implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly snackBar = inject(MatSnackBar);

  events = signal<EventResponseDto[]>([]);
  isLoading = signal(true);

  readonly EventStatus = EventStatus;
  readonly displayedColumns = ['name', 'status', 'date', 'participants', 'price', 'actions'];

  ngOnInit(): void {
    this.loadEvents();
  }
  loadEvents(): void {
    this.isLoading.set(true);
    this.eventService.getAll().subscribe({
      next: (events: EventResponseDto[]) => {
        this.events.set(events);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des événements.', 'Fermer', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  start(id: string): void {
    this.eventService.start(id).subscribe({
      next: () => {
        this.snackBar.open('Événement démarré !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }

  cancel(id: string): void {
    const reason = window.prompt("Raison de l'annulation (optionnel) :") ?? undefined;
    if(!window.confirm("Confirmez l'annulation de cet événement ?")) return;
    this.eventService.cancel(id, reason).subscribe({
      next: () => {
        this.snackBar.open('Événement annulé !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }

  close(id: string): void {
    this.eventService.close(id).subscribe({
      next: () => {
        this.snackBar.open('Événement clôturé !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }

  delete(id: string): void {
    if (!window.confirm('Supprimer cet événement définitivement ? ' +
      'Toutes les inscriptions seront supprimées et les statistiques ne seront pas comptabilisées pour cet événement')) return;
    this.eventService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Événement supprimé !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }

  getStatusLabel(status: EventStatus): string {
    const labels: Record<EventStatus, string> = {
      [EventStatus.EnAttente]: 'En attente',
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
