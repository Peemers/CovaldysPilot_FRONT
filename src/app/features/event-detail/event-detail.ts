import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EventService} from '../../shared/services/event';
import {SignInService} from '../../shared/services/sign-in';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {EventResponseDto, EventStatus} from '../../shared/models/event.models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../shared/services/auth';
import {SignInResponseDto} from "../../shared/models/sign-in.models";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-event-detail',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);
  private readonly signInService = inject(SignInService);
  private readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);

  event = signal<EventResponseDto | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  signIns = signal<SignInResponseDto[]>([])

  readonly EventStatus = EventStatus

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }

  loadEvent(id: string): void {
    this.isLoading.set(true);
    this.eventService.getById(id).subscribe({
      next: (event: EventResponseDto) => {
        this.event.set(event);
        if (this.authService.isAdmin()) {
          this.loadSignIns(event.id);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Événement introuvable');
        this.isLoading.set(false);
      }
    });
  }

  register(): void {
    const id = this.event()?.id;
    if (!id) return;
    this.signInService.register(id).subscribe({
      next: () => {
        this.snackBar.open('Inscription confirmée!', 'Fermer', {duration: 3000});
        this.loadEvent(id);
      },
      error: (err) => {
        this.snackBar.open(err.error.message ?? 'Erreur lors de l\'inscription.', 'Fermer', {duration: 4000});
      }
    });
  }

  unregister(signInId: string): void {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this.signInService.unregister(signInId).subscribe({
      next: () => {
        this.snackBar.open('Désinscription', 'Fermer', {duration: 3000});
        this.loadEvent(eventId);
      },
      error: (err) => {
        this.snackBar.open(err.error.message ?? 'Erreur lors de la désinscription', 'Fermer', {duration: 4000});
      }
    })
  }

  start(): void {
    const id = this.event()?.id;
    if (!id) return;
    this.eventService.start(id).subscribe({
      next: () => {
        this.snackBar.open('Événement démarré !', 'Fermer', {duration: 3000});
        this.loadEvent(id);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors du démarrage.', 'Fermer', {duration: 4000});
      }
    });
  }

  cancel(): void {
    const id = this.event()?.id;
    if (!id) return;
    const reason = window.prompt("Raison de l'annulation (optionnel) :") ?? undefined;
    if (!window.confirm("Confirmer l'annulation de cet événement ?")) return;
    this.eventService.cancel(id, reason).subscribe({
      next: () => {
        this.snackBar.open('Evénement annulé', 'Fermer', {duration: 3000});
        this.loadEvent(id);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de l\'annulation.', 'Fermer', {duration: 4000});
      }
    })
  }

  close(): void {
    const id = this.event()?.id;
    if (!id) return;
    this.eventService.close(id).subscribe({
      next: () => {
        this.snackBar.open('Evénement cloturé', 'Fermer', {duration: 4000})
        this.loadEvent(id);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de la cloture.', 'Fermer', {duration: 4000});
      }
    })
  }

  adminUnregister(signInId: string): void {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this.signInService.unregister(signInId).subscribe({
      next: () => {
        this.snackBar.open('Membre désinscrit !', 'Fermer', { duration: 3000 });
        this.loadSignIns(eventId);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }
  loadSignIns(eventId: string): void {
    this.signInService.getByEvent(eventId).subscribe({
      next: (signIns: SignInResponseDto[]) => {
        this.signIns.set(signIns);
      }
    });
  }
  validatePayment(signInId: string): void {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this.signInService.validatePayment(signInId).subscribe({
      next: () => {
        this.snackBar.open('Paiement validé !', 'Fermer', { duration: 3000 });
        this.loadSignIns(eventId);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de la validation.', 'Fermer', { duration: 4000 });
      }
    });
  }
}


