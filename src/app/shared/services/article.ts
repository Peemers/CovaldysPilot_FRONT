import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ArticleResponseDto, CreateArticleRequestDto, UpdateArticleRequestDto} from "../models/article.models";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly apiUrl = `${environment.apiUrl}/api/article`
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
