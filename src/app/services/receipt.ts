import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReceiptService {
  private base = 'https://api.shyamjisewasamiti.org/api/receipts';
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  list(page: number = 1, limit: number = 10, status: string = 'success') {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('status', status);
    const options: any = { params };
    if (headers) {
      options.headers = headers;
    }
    return this.http.get(this.base, options);
  }

  get(id: string) {
    const headers = this.getHeaders();
    const options: any = {};
    if (headers) {
      options.headers = headers;
    }
    return this.http.get(`${this.base}/${id}`, options);
  }

  recordFailedPayment(data: any) {
    return this.http.post('https://api.shyamjisewasamiti.org/api/payment/record-failed', data);
  }
}
