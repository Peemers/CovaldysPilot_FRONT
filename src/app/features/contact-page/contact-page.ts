import {Component, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-contact-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatInput, MatInputModule,
    MatDividerModule
  ],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {

  contactForm: FormGroup;
  isLoading = signal(false)
  errorMessage = signal<string | null>(null)

  constructor(
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      name: ['',],
      phone: [''],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required],
    })
  }

  onSubmit(): void {
    if (!this.contactForm.valid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = this.contactForm.value;
    console.log('Formulaire envoyé:', formData);

    setTimeout(() => {
      this.isLoading.set(false);
      this.contactForm.reset();
    }, 1500);
  }

  //todo brancher le formulaire de contact sur un email service...
}




