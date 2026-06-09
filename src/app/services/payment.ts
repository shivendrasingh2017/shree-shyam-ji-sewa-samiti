import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private baseUrl = 'https://api.shyamjisewasamiti.org/api/payment';

  constructor(private http: HttpClient) {}

  /** Razorpay public key fetch karo */
  getKey(): Observable<any> {
    return this.http.get(`${this.baseUrl}/key`).pipe(
      timeout(10000),
      retry(2)
    );
  }

  /**
   * Payment order create karo
   * Amount rupees mein bhejo — backend paise mein convert karega
   */
  createOrder(amount: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/create-order`, { amount })
      .pipe(timeout(15000));
  }

  /**
   * Payment verify karo (server-side signature check)
   * Fraud prevention ke liye zaroori hai
   */
  verifyPayment(paymentData: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/verify-payment`, paymentData)
      .pipe(timeout(15000));
  }

  /**
   * Failed payment record karo — admin dashboard mein dikhega
   * Razorpay ke payment.failed event aur ondismiss dono pe call karo
   */
  recordFailed(payload: {
    amount: number;
    currency?: string;
    campaignId?: string;
    donorFullName?: string;
    donorCountryCode?: string;
    donorMobile?: string;
    donorEmail?: string;
    donorNationality?: string;
    donorPAN?: string;
    donorAddress?: string;
    donorMessage?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    errorCode?: string;
    errorDescription?: string;
  }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/record-failed`, payload)
      .pipe(timeout(10000));
  }
}