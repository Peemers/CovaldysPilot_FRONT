import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateEventRequestDto, EventResponseDto, UpdateEventRequestDto} from "../models/event.models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly apiUrl = 'https://localhost:7124/api/event';
  private readonly http = inject(HttpClient);

  getAll(): Observable<EventResponseDto[]> {
    return this.http.get<EventResponseDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEventRequestDto): Observable<EventResponseDto> {
    return this.http.post<EventResponseDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateEventRequestDto): Observable<EventResponseDto> {
    return this.http.put<EventResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cancel(id: string, reason?: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {cancellationReason: reason ?? null});
  }

  start(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/start`, {});
  }

  close(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/close`, {});
  }



}
