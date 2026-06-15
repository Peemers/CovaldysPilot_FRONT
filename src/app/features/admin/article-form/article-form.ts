import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ArticleService} from "../../../shared/services/article";

@Component({
  selector: 'app-article-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly articleService = inject(ArticleService);
  private readonly snackBar = inject(MatSnackBar);

  isEditMode = signal(false);
  isLoading = signal(false);
  articleId = signal<string | null>(null);
  selectedFiles = signal<File[]>([]);
  previewUrls = signal<string[]>([]);
  isUploadingImage = signal(false);
  existingImageIds = signal<string[]>([]);

  articleForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required]],
    author: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.articleId.set(id);
      this.loadArticle(id);
    }
  }

  loadArticle(id: string): void {
    this.isLoading.set(true);
    this.articleService.getById(id).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          title: article.title,
          content: article.content,
          author: article.author,
        });
        if (article.images && article.images.length > 0) {
          this.previewUrls.set(article.images.map(img => img.url));
          this.existingImageIds.set(article.images.map(img => img.id));
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement.', 'Fermer', {duration: 3000});
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) return;

    this.isLoading.set(true);

    const dto = {
      title: this.articleForm.value.title,
      content: this.articleForm.value.content,
      author: this.articleForm.value.author,
    };

    const request = this.isEditMode()
     ? this.articleService.update(this.articleId()!, dto)
     : this.articleService.create(dto);

    request.subscribe({
      next: (article) => {
        if (this.selectedFiles().length > 0) {
          this.uploadImages(article.id);
        }
        this.snackBar.open(
         this.isEditMode() ? 'Article modifié !' : 'Article créé !',
         'Fermer', {duration: 3000}
        );
        void this.router.navigate(['/admin/articles']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
        this.isLoading.set(false);
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open('Format non supporté.', 'Fermer', {duration: 3000});
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('Image trop lourde. Maximum 10MB.', 'Fermer', {duration: 3000});
      return;
    }

    if (this.existingImageIds().length + this.selectedFiles().length >= 2) {
      this.snackBar.open('Maximum 2 images par article.', 'Fermer', {duration: 3000});
      return;
    }

    this.selectedFiles.update(files => [...files, file]);

    const reader = new FileReader();
    reader.onload = (e) => this.previewUrls.update(urls => [...urls, e.target?.result as string]);
    reader.readAsDataURL(file);
  }

  removeFile(index: number): void {
    const totalExisting = this.existingImageIds().length;

    if (index < totalExisting) {
      const imageId = this.existingImageIds()[index];
      const articleId = this.articleId()!;
      this.articleService.deleteImage(articleId, imageId).subscribe({
        next: () => {
          this.existingImageIds.update(ids => ids.filter((_, i) => i !== index));
          this.previewUrls.update(urls => urls.filter((_, i) => i !== index));
          this.snackBar.open('Image supprimée !', 'Fermer', {duration: 3000});
        },
        error: () => {
          this.snackBar.open('Erreur suppression image.', 'Fermer', {duration: 3000});
        }
      });
    } else {
      const newIndex = index - totalExisting;
      this.selectedFiles.update(files => files.filter((_, i) => i !== newIndex));
      this.previewUrls.update(urls => urls.filter((_, i) => i !== index));
    }
  }

  uploadImages(articleId: string): void {
    const files = this.selectedFiles();
    if (files.length === 0) return;

    this.isUploadingImage.set(true);
    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      this.articleService.uploadImage(articleId, formData).subscribe({
        next: () => this.isUploadingImage.set(false),
        error: () => {
          this.snackBar.open('Erreur upload image.', 'Fermer', {duration: 3000});
          this.isUploadingImage.set(false);
        }
      });
    });
  }
}
