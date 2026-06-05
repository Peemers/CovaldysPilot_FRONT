export interface SiteConfigurationResponseDto {
  isMaintenanceMode: boolean;
  globalAlertMessage?: string;
}

export interface UpdateMaintenanceRequestDto {
  isMaintenanceMode: boolean;
}

export interface UpdateAlertRequestDto {
  globalAlertMessage?: string;
}
