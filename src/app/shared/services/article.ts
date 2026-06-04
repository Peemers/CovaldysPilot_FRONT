import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ArticleResponseDto, CreateArticleRequestDto, UpdateArticleRequestDto} from "../models/article.models";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly apiUrl = 'https://localhost:7124/api/article'
  private readonly http = inject(HttpClient);

  getAll(): Observable<ArticleResponseDto[]> {
    return this.http.get<ArticleResponseDto[]>(this.apiUrl)
  }
  getById(id: string): Observable<ArticleResponseDto>{
    return this.http.get<ArticleResponseDto>(`${this.apiUrl}/${id}`)
  }
  create(dto: CreateArticleRequestDto) : Observable<ArticleResponseDto>{
    return this.http.post<ArticleResponseDto>(this.apiUrl, dto)
  }
  update(id: string, dto: UpdateArticleRequestDto) : Observable<ArticleResponseDto>{
    return this.http.put<ArticleResponseDto>(`${this.apiUrl}/${id}`, dto)
  }
  delete(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
