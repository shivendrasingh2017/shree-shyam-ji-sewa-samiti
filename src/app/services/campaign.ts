import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private base = 'https://api.shyamjisewasamiti.org/api/campaigns';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  list() {
    return this.http.get(`${this.base}`);
  }

  get(id: string) {
    return this.http.get(`${this.base}/${id}`);
  }

  create(payload: any) {
    const options: any = this.getHeaders();
    return this.http.post(this.base, payload, options);
  }

  update(id: string, payload: any) {
    const options: any = this.getHeaders();
    return this.http.put(`${this.base}/${id}`, payload, options);
  }

  toggleActive(id: string, active: boolean) {
    const options: any = this.getHeaders();
    return this.http.put(`${this.base}/${id}`, { active }, options);
  }

  delete(id: string) {
    const options: any = this.getHeaders();
    return this.http.delete(`${this.base}/${id}`, options);
  }
}
