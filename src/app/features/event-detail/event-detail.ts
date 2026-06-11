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
import {ReviewService} from '../../shared/services/review';
import {ReviewResponseDto} from '../../shared/models/review.models';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {WeatherService} from "../../shared/services/weather";
import {WeatherData} from "../../shared/models/weather.models";

@Component({
  selector: 'app-event-detail',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterLink,
    DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);
  private readonly signInService = inject(SignInService);
  private readonly reviewService = inject(ReviewService);
  private readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  private readonly weatherService = inject(WeatherService);

  event = signal<EventResponseDto | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  signIns = signal<SignInResponseDto[]>([])
  reviews = signal<ReviewResponseDto[]>([])

  newReviewNote = signal<number>(0);
  newReviewComment = signal<string>('');
  userReview = signal<ReviewResponseDto | null>(null);

  weather = signal<WeatherData | null>(null);
  weatherError = signal<boolean>(false);

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
        if (event.status === EventStatus.Termine) {
          this.loadReviews(event.id);
        }
        if (event.location){
          this.loadWeather(event.location, event.startDate)
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Événement introuvable');
        this.isLoading.set(false);
      }
    });
  }

  loadReviews(eventId: string): void {
    this.reviewService.getByEvent(eventId).subscribe({
      next: (reviews: ReviewResponseDto[]) => {
        this.reviews.set(reviews);
        // Cherche si l'utilisateur a déjà un avis
        const userId = this.authService.user()?.userId;
        if (userId) {
          const existing = reviews.find(r => r.userId === userId);
          this.userReview.set(existing ?? null);
          if (existing) {
            this.newReviewNote.set(existing.note);
            this.newReviewComment.set(existing.comment ?? '');
          }
        }
      }
    });
  }

  submitReview(): void {
    const eventId = this.event()?.id;
    if (!eventId || this.newReviewNote() === 0) return;

    const existing = this.userReview();
    if (existing) {
      this.reviewService.update(existing.id, {
        note: this.newReviewNote(),
        comment: this.newReviewComment()
      }).subscribe({
        next: () => {
          this.snackBar.open('Avis modifié !', 'Fermer', {duration: 3000});
          this.loadReviews(eventId);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
        }
      });
    } else {
      this.reviewService.create({
        eventId,
        note: this.newReviewNote(),
        comment: this.newReviewComment()
      }).subscribe({
        next: () => {
          this.snackBar.open('Avis publié !', 'Fermer', {duration: 3000});
          this.loadReviews(eventId);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
        }
      });
    }
  }

  deleteReview(): void {
    const eventId = this.event()?.id;
    const existing = this.userReview();
    if (!existing || !eventId) return;
    this.reviewService.delete(existing.id).subscribe({
      next: () => {
        this.snackBar.open('Avis supprimé !', 'Fermer', {duration: 3000});
        this.userReview.set(null);
        this.newReviewNote.set(0);
        this.newReviewComment.set('');
        this.loadReviews(eventId);
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
    this.signInService.adminUnregister(signInId).subscribe({
      next: () => {
        this.snackBar.open('Membre désinscrit !', 'Fermer', {duration: 3000});
        this.loadSignIns(eventId);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
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
        this.snackBar.open('Paiement validé !', 'Fermer', {duration: 3000});
        this.loadSignIns(eventId);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur lors de la validation.', 'Fermer', {duration: 4000});
      }
    });
  }

  loadWeather(location: string, date: string): void{
    this.weatherService.getWeatherForEvent(location, date).subscribe({
      next: (data) => this.weather.set(data),
      error: (err) => {this.weatherError.set(true)}
    })
  }

  getStars(note: number): string {
    return '⭐'.repeat(note);
  }
}


