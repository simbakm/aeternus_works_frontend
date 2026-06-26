import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  role: string;
}

export interface UpdateAdminUserRequest {
  username?: string;
  email?: string;
  role?: string;
}

export interface CreatedCredentials {
  username: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = `${API_URL}/admin-users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.apiUrl);
  }

  create(request: CreateAdminUserRequest): Observable<CreatedCredentials> {
    return this.http.post<CreatedCredentials>(this.apiUrl, request);
  }

  update(id: string, request: UpdateAdminUserRequest): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  sendCredentials(id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/send-credentials`, { password });
  }
}
