import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponseDto } from '../models/event.models';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/category`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<CategoryResponseDto[]> {
    return this.http.get<CategoryResponseDto[]>(this.apiUrl);
  }

  create(name: string): Observable<CategoryResponseDto> {
    return this.http.post<CategoryResponseDto>(this.apiUrl, { name });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}