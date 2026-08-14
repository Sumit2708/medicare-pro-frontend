import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AppointmentService } from '../appointment.service';
import { SettingsService } from '../../../settings/services/settings.service';
import { AppointmentSlot } from '../../model/appointment-slot.model';
import { AppointmentStatus } from '../../../../core/enums/appointment-status.enum';
@Injectable({
  providedIn: 'root',
})
export class AppointmentAvailabilityService {
  private readonly SLOT_DURATION_MINUTES = 30;

  constructor(
    private appointmentService: AppointmentService,
    private settingsService: SettingsService,
  ) {}

  getAvailableSlots(
    selectedDate: string,
    doctorId: number,
  ): Observable<AppointmentSlot[]> {
    return this.settingsService.getSettings().pipe(
      switchMap((settings) => {
        const workingDay = this.getWorkingDay(
          selectedDate,
          settings.workingHours.days,
        );

        if (!workingDay || !workingDay.enabled) {
          return of([]);
        }

        return this.appointmentService.getAppointments().pipe(
          map((appointments) => {
            const slots = this.generateSlots(
              workingDay.startTime,
              workingDay.endTime,
            );

            const bookedSlots = appointments
              .filter(
                (appointment) =>
                  appointment.doctorId === doctorId &&
                  appointment.appointmentDate === selectedDate &&
                  appointment.status !== AppointmentStatus.CANCELLED,
              )
              .map((appointment) => appointment.appointmentTime);

            return slots.map((slot) => ({
              ...slot,
              available: !bookedSlots.includes(slot.time),
            }));
          }),
        );
      }),
    );
  }
  private getWorkingDay(
    selectedDate: string,
    workingDays: {
      day: string;
      enabled: boolean;
      startTime: string;
      endTime: string;
    }[],
  ) {
    const date = new Date(`${selectedDate}T00:00:00`);

    const dayName = date.toLocaleDateString('en-US', {
      weekday: 'long',
    });

    return workingDays.find((day) => day.day === dayName);
  }

  private generateSlots(startTime: string, endTime: string): AppointmentSlot[] {
    const slots: AppointmentSlot[] = [];

    let currentMinutes = this.timeToMinutes(startTime);

    const endMinutes = this.timeToMinutes(endTime);

    while (currentMinutes + this.SLOT_DURATION_MINUTES <= endMinutes) {
      slots.push({
        time: this.minutesToTime(currentMinutes),

        available: true,
      });

      currentMinutes += this.SLOT_DURATION_MINUTES;
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
