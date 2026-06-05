import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteConfigurationResponseDto, UpdateAlertRequestDto, UpdateMaintenanceRequestDto } from '../models/site-configuration.models';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigurationService {
  private readonly apiUrl = 'https://localhost:7124/api/admin/config';
  private readonly http = inject(HttpClient);

  config = signal<SiteConfigurationResponseDto | null>(null); //tous les services peuveut lire siteConfig

  loadConfig(): void {
    this.http.get<SiteConfigurationResponseDto>(this.apiUrl).subscribe({
      next: (config) => {
        console.log('Config chargée:', config);
        this.config.set(config)
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
