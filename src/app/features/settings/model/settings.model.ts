import { ClinicSettings } from './clinic-settings.model';
import { BillingSettings } from './billing-settings.model';
import { WorkingHours } from './working-hours.model';

export interface Settings {
  id?: number;

  clinic: ClinicSettings;

  billing: BillingSettings;

  workingHours: WorkingHours;
}