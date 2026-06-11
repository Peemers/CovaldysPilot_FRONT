import {Component, signal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router, RouterLink} from "@angular/router";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle} from "@angular/material/card";
import {AuthService} from "../../../shared/services/auth";
import {ChangePasswordRequestDto} from "../../../shared/models/auth.models";
import {MatSnackBar} from "@angular/material/snack-bar";

const passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
  const newPassword = group.get('newPassword')?.value as string;
  const confirmNewPassword = group.get('confirmNewPassword')?.value as string;
  return newPassword === confirmNewPassword ? null : {passwordMismatch: true};
};

@Component({
  selector: 'app-change-password',
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
    MatCardSubtitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  changePwd: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
   private fb: FormBuilder,
   private authService: AuthService,
   private router: Router,
   private snackBar: MatSnackBar
  ) {
    this.changePwd = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmNewPassword: ['', [Validators.required]],
    }, {validators: passwordMatchValidator});
  }

  onSubmit(): void {
    if (!this.changePwd.valid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: ChangePasswordRequestDto = this.changePwd.value as ChangePasswordRequestDto;

    this.authService.changePassword(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Mot de passe changé avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        void this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Une erreur est survenue.');
      }
    });
  }
}