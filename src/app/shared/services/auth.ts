import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ConnectedUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://localhost:7124/api/auth';

  // État de l'utilisateur connecté
  private currentUser = signal<ConnectedUser | null>(null);
  private accessToken = signal<string | null>(null);

  // Signals publics en lecture seule
  readonly user = computed(() => this.currentUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  readonly isMembershipUpToDate = computed(() => this.currentUser()?.isMembershipUpToDate ?? false);

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/']);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.accessToken.set(response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    this.currentUser.set({
      userId: response.userId,
      pseudo: response.pseudo,
      role: response.role,
      isMembershipUpToDate: false // sera mis à jour plus tard
    });
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('refreshToken');
  }
}
