import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http: HttpClient
  ) { }

   API_URL = 'http://localhost:3000/appointments';


  getAppointments() {
    return this.http.get(`${this.API_URL}`);
  }

  createAppointment(appointmentData: any) {
    return this.http.post(`${this.API_URL}`, appointmentData);
  }

  updateAppointment(appointmentId: string, appointmentData: any) {
    return this.http.put(`${this.API_URL}/${appointmentId}`, appointmentData);
  }

  deleteAppointment(appointmentId: string) {
    return this.http.delete(`${this.API_URL}/${appointmentId}`);
  }

  getAppointmentById(appointmentId: number) {
    return this.http.get(`${this.API_URL}/${appointmentId}`);
  }
}
