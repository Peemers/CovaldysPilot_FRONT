import {Component, inject, OnInit, signal} from '@angular/core';
import {ArticleService} from "../../shared/services/article";
import {ArticleResponseDto} from "../../shared/models/article.models";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-articles',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe, SlicePipe,
    RouterLink
  ],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles implements OnInit {
  private readonly articleService = inject(ArticleService);

  articles = signal<ArticleResponseDto[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

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
      error: (error: Error) => {
        this.errorMessage.set("Erreur lors du chargement des articles");
        this.isLoading.set(false);
      }
    });
  }
}
