import {Injectable, signal, computed} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthResponse, LoginRequest, RegisterRequest, ConnectedUser, ChangePasswordRequestDto} from '../models/auth.models';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  private currentUser = signal<ConnectedUser | null>(null);
  private accessToken = signal<string | null>(null);

  readonly user = computed(() => this.currentUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  readonly isMembershipUpToDate = computed(() => this.currentUser()?.isMembershipUpToDate ?? false);

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

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
      this.http.post(`${this.apiUrl}/logout`, {refreshToken}).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/']);
  }

  changePassword(request: ChangePasswordRequestDto): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/change-password`, request);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {refreshToken}).pipe(
     tap((response: AuthResponse) => this.handleAuthResponse(response))
    );
  }

  private restoreSession(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();


      if (isExpired) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {refreshToken}).pipe(
            tap((response: AuthResponse) => this.handleAuthResponse(response))
          ).subscribe({
            error: () => {
              this.clearSession();
            }
          });
        } else {
          this.clearSession();
        }
        return;
      }
      this.accessToken.set(token);
      this.currentUser.set({
        userId: payload.sub,
        pseudo: payload.pseudo,
        role: payload.role,
        isMembershipUpToDate: payload.isMembershipUpToDate === 'true',
        firstName: payload.firstname,
        lastName: payload.lastname,
      });
    } catch(e) {
      this.clearSession();
    }
  }
  updateMembershipStatus(isMembershipUpToDate: boolean): void {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({
        ...current,
        isMembershipUpToDate
      });
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.accessToken.set(response.accessToken);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    this.currentUser.set({
      userId: response.userId,
      pseudo: response.pseudo,
      role: response.role,
      isMembershipUpToDate: response.isMembershipUpToDate,
      firstName: response.firstName,
      lastName: response.lastName,
    });
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
