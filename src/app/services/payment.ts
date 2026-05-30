import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  
  private baseUrl = 'https://api.shyamjisewasamiti.org/api/payment';

  constructor(private http: HttpClient) {}

  /**
   * Get Razorpay public key from backend
   */
  getKey(): Observable<any> {
    return this.http.get(`${this.baseUrl}/key`);
  }

  /**
   * Create a payment order on backend
   */
  createOrder(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order`, { amount });
  }

  /**
   * Verify payment signature with backend (secure verification)
   * This prevents fraud by verifying the signature server-side
   */
  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-payment`, paymentData);
  }

  /**
   * Record a failed payment attempt so admin can review failed donations
   */
  recordFailed(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/record-failed`, payload);
  }
}
