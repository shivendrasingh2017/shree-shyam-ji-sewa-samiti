import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'https://api.shyamjisewasamiti.org/api/auth';
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.base}/login`, { username, password });
  }

  validateToken(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.base}`, { headers });
  }

  // fetch admin users (requires Authorization header)
  getUsers() {
    const token = localStorage.getItem('admin_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.base}/users`, { headers });
  }
}
