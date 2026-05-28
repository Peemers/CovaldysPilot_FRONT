import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SignInResponseDto} from "../models/sign-in.models";

@Injectable({
  providedIn: 'root',
})
export class SignInService {

  private readonly apiUrl = 'http://localhost:7124/sign-in';
  private readonly http = inject(HttpClient);

  register(eventId: string): Observable<SignInResponseDto>{
    return this.http.post<SignInResponseDto>(this.apiUrl, {eventId});
  }

  Unregister(signInId: string) : Observable<SignInResponseDto>{
    return this.http.delete<SignInResponseDto>(`${this.apiUrl}/${signInId}`)
  }

  getMySignIn(): Observable<SignInResponseDto>{
    return this.http.get<SignInResponseDto>('${this.apiUrl}/user')
  }

  getByEvent(eventId: string): Observable<SignInResponseDto>{
    return this.http.get<SignInResponseDto>(`$\{this.apiUrl}/event/${eventId}`);
  }
}
