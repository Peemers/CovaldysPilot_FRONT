import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SignInResponseDto} from "../models/sign-in.models";

@Injectable({
  providedIn: 'root',
})
export class SignInService {

  private readonly apiUrl = 'https://localhost:7124/api/signin';
  private readonly http = inject(HttpClient);

  register(eventId: string): Observable<SignInResponseDto> {
    return this.http.post<SignInResponseDto>(this.apiUrl, {eventId});
  }

  unregister(signInId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${signInId}`)
  }

  getMySignIn(): Observable<SignInResponseDto[]> {
    return this.http.get<SignInResponseDto[]>(`${this.apiUrl}/user`)
  }

  getByEvent(eventId: string): Observable<SignInResponseDto[]> {
    return this.http.get<SignInResponseDto[]>(`${this.apiUrl}/event/${eventId}`);
  }

  validatePayment(signInId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${signInId}/validate`, {});
  }
}
