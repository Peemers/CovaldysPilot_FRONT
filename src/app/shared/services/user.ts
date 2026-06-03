import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponseDto} from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://localhost:7124/api/admin/users';
  private readonly http = inject(HttpClient)

  getAll(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportMembers(filter?: string): Observable<Blob> {
    const url = filter
      ? `${this.apiUrl}/export?filter=${filter}`
      : `${this.apiUrl}/export`;
    return this.http.get(url, {responseType: 'blob'});
  }
}
