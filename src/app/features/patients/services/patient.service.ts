import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../../shared/models/patient.model';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

    private apiUrl = `${environment.API_URL}${API_ENDPOINTS.PATIENTS}`;

 constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  addPatient(patient: Patient) {
    return this.http.post(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: Patient) {
    return this.http.put(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPatientById(id: any): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }
}
