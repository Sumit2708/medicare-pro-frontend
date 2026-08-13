import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Settings } from '../model/settings.model';
import { ClinicSettings } from '../model/clinic-settings.model';
import { BillingSettings } from '../model/billing-settings.model';
import { WorkingHours } from '../model/working-hours.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiUrl = 'http://localhost:3000/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.apiUrl);
  }

  updateSettings(settings: Settings): Observable<Settings> {
    return this.http.put<Settings>(this.apiUrl, settings);
  }

  updateClinic(
    clinic: ClinicSettings,
    currentSettings: Settings,
  ): Observable<Settings> {
    return this.updateSettings({
      ...currentSettings,
      clinic,
    });
  }

  updateBilling(
    billing: BillingSettings,
    currentSettings: Settings,
  ): Observable<Settings> {
    return this.updateSettings({
      ...currentSettings,
      billing,
    });
  }

  updateWorkingHours(
  workingHours: WorkingHours,
  currentSettings: Settings
): Observable<Settings> {

  return this.updateSettings({

    ...currentSettings,

    workingHours

  });

}
}
