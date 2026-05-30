import {Component, inject, OnInit, signal} from '@angular/core';
import {EventService} from '../../../shared/services/event';
import {EventResponseDto, EventStatus} from '../../../shared/models/event.models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly eventService= inject(EventService);

  totalEvents = signal(0)
  upcomingEvents = signal(0)
  ongoingEvents = signal(0)
  nextEvent = signal<EventResponseDto | null>(null);

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats() : void {
    this.eventService.getAll().subscribe({
      next: (events: EventResponseDto[]) => {
        this.totalEvents.set(events.length);
        this.upcomingEvents.set(
          events.filter(e => e.status === EventStatus.EnAttente).length
        );
        this.ongoingEvents.set(
          events.filter(e => e.status === EventStatus.EnCours).length
        );

        const next = events
          .filter(e => e.status === EventStatus.EnAttente)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
        this.nextEvent.set(next ?? null);
      }
    })
  }
}
