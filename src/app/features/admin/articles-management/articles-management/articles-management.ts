import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { ArticleService } from '../../../../shared/services/article'
import { ArticleResponseDto } from '../../../../shared/models/article.models';

@Component({
  selector: 'app-articles-management',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe,
    MatTooltip,
  ],
  templateUrl: './articles-management.html',
  styleUrl: './articles-management.scss',
})
export class ArticlesManagement implements OnInit {
  private readonly articleService = inject(ArticleService);
  private readonly snackBar = inject(MatSnackBar);

  articles = signal<ArticleResponseDto[]>([]);
  isLoading = signal(true);

  readonly displayedColumns = ['title', 'author', 'publicationDate', 'viewCount', 'actions'];

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading.set(true);
    this.articleService.getAll().subscribe({
      next: (articles: ArticleResponseDto[]) => {
        this.articles.set(articles);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des articles.', 'Fermer', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  delete(id: string): void {
    if (!window.confirm('Supprimer cet article définitivement ?')) return;
    this.articleService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Article supprimé !', 'Fermer', { duration: 3000 });
        this.loadArticles();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', { duration: 4000 });
      }
    });
  }
}