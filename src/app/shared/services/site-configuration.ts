import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteConfigurationResponseDto, UpdateAlertRequestDto, UpdateMaintenanceRequestDto } from '../models/site-configuration.models';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SiteConfigurationService {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/config`;
  private readonly http = inject(HttpClient);

  config = signal<SiteConfigurationResponseDto | null>(null); //tous les services peuveut lire siteConfig

  loadConfig(): void {
    this.http.get<SiteConfigurationResponseDto>(this.apiUrl).subscribe({
      next: (config) => {
        console.log('Config chargée:', config);
        this.config.set(config)
      },
      error: (err) => {

      }
    });
  }

  updateMaintenance(dto: UpdateMaintenanceRequestDto): Observable<SiteConfigurationResponseDto> {
    return this.http.patch<SiteConfigurationResponseDto>(`${this.apiUrl}/maintenance`, dto);
  }

  updateAlert(dto: UpdateAlertRequestDto): Observable<SiteConfigurationResponseDto> {
    return this.http.patch<SiteConfigurationResponseDto>(`${this.apiUrl}/alert`, dto);
  }
}
