export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
  token: string;
}