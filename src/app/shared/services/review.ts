import {inject, Injectable} from '@angular/core';
import {CreateReviewRequestDto, ReviewResponseDto, UpdateReviewRequestDto} from '../models/review.models';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ReviewService {
  private readonly apiUrl = 'https://localhost:7124/api/review';
  private readonly http = inject(HttpClient);

  getByEvent(eventId: string): Observable<ReviewResponseDto[]> {
    return this.http.get<ReviewResponseDto[]>(`${this.apiUrl}/event/${eventId}`);
  }

  create(dto: CreateReviewRequestDto): Observable<ReviewResponseDto> {
    return this.http.post<ReviewResponseDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateReviewRequestDto): Observable<ReviewResponseDto> {
    return this.http.put<ReviewResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
