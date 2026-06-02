import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EventService} from "../../../shared/services/event";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {CategoryResponseDto, CreateEventRequestDto, UpdateEventRequestDto} from "../../../shared/models/event.models";
import {CategoryService} from "../../../shared/services/category";
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCard, MatCardContent],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly categoryService = inject(CategoryService)
  private readonly snackBar = inject(MatSnackBar);

  eventForm!: FormGroup;
  isLoading = signal(false)
  isEditMode = signal(false)
  eventId = signal<string | null>(null)
  categories = signal<CategoryResponseDto[]>([])

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true)
      this.eventId.set(id)
      this.loadEvent(id)
    }
  }

  buildForm(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required]],
      location: [''],
      price: [null],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      registrationDeadline: ['', [Validators.required]],
      minParticipants: [1, [Validators.required, Validators.min(1), Validators.max(200)]],
      maxParticipants: [1, [Validators.required, Validators.min(1), Validators.max(200)]],
      isWaitingListActive: [false],
      categoryIds: [[]]
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories: CategoryResponseDto[]) => {
        this.categories.set(categories);
      }
    });
  }

  loadEvent(id: string): void {
    this.isLoading.set(true);
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          name: event.name,
          description: event.description,
          location: event.location,
          price: event.price,
          startDate: event.startDate.slice(0, 16),
          endDate: event.endDate.slice(0, 16),
          registrationDeadline: event.registrationDeadline.slice(0, 16),
          minParticipants: event.minParticipants,
          maxParticipants: event.maxParticipants,
          isWaitingListActive: event.isWaitingListActive,
          categoryIds: event.categories.map(c => c.id)
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Événement introuvable.', 'Fermer', {duration: 3000});
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.eventForm.value;

    if (this.isEditMode()) {
      const dto: UpdateEventRequestDto = formValue as UpdateEventRequestDto;
      this.eventService.update(this.eventId()!, dto).subscribe({
        next: () => {
          this.snackBar.open('Événement modifié !', 'Fermer', {duration: 3000});
          void this.router.navigate(['/admin/events']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
          this.isLoading.set(false);
        }
      });
    } else {
      const dto: CreateEventRequestDto = formValue as CreateEventRequestDto;
      this.eventService.create(dto).subscribe({
        next: () => {
          this.snackBar.open('Événement créé !', 'Fermer', {duration: 3000});
          void this.router.navigate(['/admin/events']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
          this.isLoading.set(false);
        }
      });
    }
  }
}
