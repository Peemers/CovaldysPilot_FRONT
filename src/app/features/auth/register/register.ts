import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, AbstractControl} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router, RouterLink} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {AuthService} from "../../../shared/services/auth";
import {RegisterRequest} from "../../../shared/models/auth.models";
import {MatDatepickerInput} from "@angular/material/datepicker";
import {MatOption, MatSelect} from "@angular/material/select";

const passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value as string;
  const confirmPassword = group.get('confirmPassword')?.value as string;
  return password === confirmPassword ? null : {passwordMismatch: true};
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatSelect,
    MatOption,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
   private fb: FormBuilder,
   private authService: AuthService,
   private router: Router,
  ) {
    this.registerForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['']
    }, {validators: passwordMatchValidator});
  }

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null)

    const request: RegisterRequest = this.registerForm.value as RegisterRequest

    this.authService.register(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/'])
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'une erreur est survenue');
      }
    });
  }
}
