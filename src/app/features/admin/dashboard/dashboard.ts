import {Component, inject, OnInit, signal} from '@angular/core';
import {EventService} from '../../../shared/services/event';
import {EventResponseDto, EventStatus} from '../../../shared/models/event.models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggle, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {SiteConfigurationService} from '../../../shared/services/site-configuration';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink,
    DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly eventService = inject(EventService);
  readonly siteConfigService = inject(SiteConfigurationService)
  private readonly snackBar = inject(MatSnackBar);

  totalEvents = signal(0)
  upcomingEvents = signal(0)
  ongoingEvents = signal(0)
  nextEvent = signal<EventResponseDto | null>(null);
  alertMessage = signal<string>('')

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats(): void {
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
    });
  }

  toggleMaintenance(): void {
    const current = this.siteConfigService.config()?.isMaintenanceMode ?? false;
    this.siteConfigService.updateMaintenance({isMaintenanceMode: !current}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open(
          config.isMaintenanceMode ? 'Site en maintenance !' : 'Site en ligne !',
          'Fermer', {duration: 3000}
        );
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  saveAlertMessage(): void {
    this.siteConfigService.updateAlert({globalAlertMessage: this.alertMessage() || undefined}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open('Message d\'alerte mis à jour !', 'Fermer', {duration: 3000});
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  clearAlertMessage(): void {
    this.alertMessage.set('');
    this.siteConfigService.updateAlert({globalAlertMessage: undefined}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open('Message d\'alerte supprimé !', 'Fermer', {duration: 3000});
      }
    });
  }
}

