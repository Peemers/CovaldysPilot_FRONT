import {Component, inject, OnInit, signal} from '@angular/core';
import {EventService} from '../../shared/services/event';
import {EventResponseDto, EventStatus} from '../../shared/models/event.models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-events-past',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe,
    SlicePipe,
    RouterLink,],
  templateUrl: './events-past.html',
  styleUrl: './events-past.scss',
})
export class EventsPast implements OnInit {
  private readonly eventService = inject(EventService);

  events = signal<EventResponseDto[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  readonly EventStatus = EventStatus;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading.set(true);
    this.eventService.getAll().subscribe({
      next: (events: EventResponseDto[]) => {
        // Filtre uniquement les événements terminés ou annulés
        this.events.set(events.filter(e =>
          e.status === EventStatus.Termine ||
          e.status === EventStatus.Annule
        ));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des événements passés.');
        this.isLoading.set(false);
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
