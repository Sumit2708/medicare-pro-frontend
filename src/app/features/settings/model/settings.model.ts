import { ClinicSettings } from './clinic-settings.model';
import { BillingSettings } from './billing-settings.model';
import { WorkingHours } from './working-hours.model';
import { UserRole } from '../../../core/enums/user-role.enum';

export interface Settings {
  id?: number;

  clinic: ClinicSettings;

  billing: BillingSettings;

  workingHours: WorkingHours;
}


export interface SettingsSection {
  id: string;
  label: string;
  description: string;
  icon: string;
  roles?: UserRole[]; // omitted = visible to every role
}