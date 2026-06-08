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

  articleForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required]],
    author: ['', [Validators.required]],
    imageUrl1: [''],
    imageUrl2: [''],
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
          imageUrl1: article.images[0]?.url ?? '',
          imageUrl2: article.images[1]?.url ?? '',
        });
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
    const imageUrls = [
      this.articleForm.value.imageUrl1,
      this.articleForm.value.imageUrl2
    ].filter((url: string) => url && url.trim() !== '');

    const dto = {
      title: this.articleForm.value.title,
      content: this.articleForm.value.content,
      author: this.articleForm.value.author,
      imageUrls
    };

    const request = this.isEditMode()
     ? this.articleService.update(this.articleId()!, dto)
     : this.articleService.create(dto);

    request.subscribe({
      next: () => {
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
}
