import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss'],
})
export class Payment {
  amount = 500;

  constructor(private paymentService: PaymentService, private http: HttpClient) {}

  payNow() {
    this.paymentService.createOrder(this.amount).subscribe((res: any) => {
      const order = res.order;

      this.paymentService.getKey().subscribe((k: any) => {
        const options: any = {
          key: k.key,
          amount: order.amount,
          currency: 'INR',
          name: 'Shyam Ji Sewa Samiti',
          description: 'Donation',
          order_id: order.id,
          handler: (response: any) => {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: order.currency || 'INR',
            };

            this.paymentService.verifyPayment(paymentData).subscribe(
              (vr: any) => {
                if (vr.success) {
                  alert('Payment verified successfully');
                } else {
                  alert('Payment verification failed');
                }
              },
              () => alert('Payment verification request failed')
            );
          },
          prefill: {
            name: '',
            email: '',
            contact: '',
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }, () => alert('Unable to fetch payment key'));
    }, () => alert('Unable to create order'));
  }
}







