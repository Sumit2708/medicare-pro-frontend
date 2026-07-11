import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../../shared/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

    private apiUrl = 'http://localhost:3000/patients';

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

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }
}
