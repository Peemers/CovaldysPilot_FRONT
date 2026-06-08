import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ArticleService} from "../../shared/services/article";
import {ArticleResponseDto} from "../../shared/models/article.models";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-article-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    RouterLink],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss',
})
export class ArticleDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService)

  article = signal<ArticleResponseDto | null>(null)
  isLoading = signal(true);
  errorMessage = signal<string | null>(null)

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadArticle(id)
  }

  loadArticle(id: string): void {
    this.isLoading.set(true);
    this.articleService.getById(id).subscribe({
      next: (article: ArticleResponseDto) => {
        this.article.set(article);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Article introuvable.');
        this.isLoading.set(false);
      }
    });
  }
}
