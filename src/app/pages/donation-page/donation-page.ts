import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Donation } from '../../components/donation/donation';
import { PaymentService } from '../../services/payment';
import { InvoicePdf } from '../../services/invoice-pdf';

@Component({
  selector: 'app-donation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Donation],
  templateUrl: './donation-page.html',
  styleUrl: './donation-page.scss',
})
export class DonationPage implements OnInit {

  // ── Banner ──────────────────────────────────────
  bannerImage: string = 'assets/donation/banner_donation1.jpg';

  // ── QR / inline form ───────────────────────────
  showInlineForm = false;   // ?open=true se true hoga
  inlineFormStep: 'form' | 'confirm' | 'success' = 'form';

  // ── Country codes list ─────────────────────────
  countryCodes = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'USA', code: '+1', flag: '🇺🇸' },
    { name: 'UK', code: '+44', flag: '🇬🇧' },
    { name: 'UAE', code: '+971', flag: '🇦🇪' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
    { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
    { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  ];

  presetAmounts = [51, 101, 501, 1001, 5001];

  // ── Form fields ────────────────────────────────
  selectedAmount: number | null = null;
  customAmount = '';
  donorFullName = '';
  donorCountryCode = '+91';
  donorMobile = '';
  donorEmail = '';
  donorPAN = '';
  donorAddress = '';
  donorMessage = '';

  // ── Errors ─────────────────────────────────────
  amountError = '';
  nameError = '';
  mobileError = '';
  panError = '';
  addressError = '';

  // ── Payment state ──────────────────────────────
  isSubmitting = false;
  paymentError = '';
  pdfLoading = false;
  lastDonation: any = null;
  private _receiptData: any = null;
  private _failedRecorded = false;
  private razorpayKey = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private invoicePdfService: InvoicePdf
  ) {}

  ngOnInit(): void {
    // QR scan detection
    this.route.queryParams.subscribe(params => {
      if (params['open'] === 'true') {
        this.showInlineForm = true;
        setTimeout(() => {
          document.getElementById('inline-donation-form')?.scrollIntoView({
            behavior: 'smooth', block: 'start'
          });
        }, 300);
      }
    });

    // Load Razorpay key
    this.paymentService.getKey().subscribe({
      next: (res: any) => { if (res?.key) this.razorpayKey = res.key; },
      error: () => console.error('Failed to load Razorpay key')
    });

    // Preload Razorpay script
    this.loadRazorpayScript();
  }

  // ── Getters ────────────────────────────────────
  get finalAmount(): number {
    if (this.selectedAmount) return this.selectedAmount;
    const v = parseFloat(this.customAmount);
    return isNaN(v) ? 0 : v;
  }

  get selectedCountryLabel(): string {
    const c = this.countryCodes.find(x => x.code === this.donorCountryCode);
    return c ? `${c.flag} ${c.code}` : this.donorCountryCode;
  }

  // ── Preset amount ──────────────────────────────
  selectPreset(amt: number): void {
    this.selectedAmount = amt;
    this.customAmount = '';
    this.amountError = '';
  }

  onCustomAmountChange(): void {
    this.selectedAmount = null;
    this.amountError = '';
  }

  // ── Validation ─────────────────────────────────
  validate(): boolean {
    this.amountError = '';
    this.nameError = '';
    this.mobileError = '';
    this.panError = '';
    this.addressError = '';

    let valid = true;
    const amt = this.finalAmount;

    if (!amt || amt < 1) {
      this.amountError = 'Please select or enter donation amount.';
      valid = false;
    } else if (amt > 100000) {
      this.amountError = 'Maximum donation per transaction is ₹1,00,000.';
      valid = false;
    }

    const fullName = this.donorFullName.trim();
    if (!fullName || fullName.length < 2) {
      this.nameError = 'Full name is required (min 2 characters).';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      this.nameError = 'Name should contain only letters.';
      valid = false;
    }

    const mobile = this.donorMobile.replace(/\s+/g, '');
    if (!mobile || !/^\d{7,15}$/.test(mobile)) {
      this.mobileError = 'Enter valid mobile number (7–15 digits).';
      valid = false;
    }

    const pan = this.donorPAN.trim().toUpperCase();
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      this.panError = 'Enter valid PAN number (e.g. ABCDE1234F).';
      valid = false;
    }

    const address = this.donorAddress.trim();
    if (!address || address.length < 10) {
      this.addressError = 'Please enter full address (min 10 characters).';
      valid = false;
    }

    return valid;
  }

  sanitize(input: string): string {
    return input
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // ── Step navigation ────────────────────────────
  proceedToConfirm(): void {
    if (!this.validate()) return;
    this.inlineFormStep = 'confirm';
    setTimeout(() => {
      document.getElementById('inline-donation-form')?.scrollIntoView({
        behavior: 'smooth', block: 'start'
      });
    }, 100);
  }

  goBackToForm(): void {
    this.inlineFormStep = 'form';
  }

  // ── Payment ────────────────────────────────────
  async initiatePayment(): Promise<void> {
    if (!this.validate()) return;

    if (!this.razorpayKey) {
      this.paymentError = 'Payment service not available. Please try again later.';
      return;
    }

    this.isSubmitting = true;
    this.paymentError = '';
    this._failedRecorded = false;

    try {
      await this.loadRazorpayScript();

      this.paymentService.createOrder(this.finalAmount).subscribe({
        next: (res: any) => {
          if (res?.success && res.order) {
            this.handleRazorpayPayment(res.order);
          } else {
            this.paymentError = 'Failed to create payment order.';
            this.isSubmitting = false;
          }
        },
        error: () => {
          this.paymentError = 'Failed to initialize payment.';
          this.isSubmitting = false;
        }
      });
    } catch {
      this.paymentError = 'Payment gateway load nahi ho paya.';
      this.isSubmitting = false;
    }
  }

  handleRazorpayPayment(order: any): void {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      this.paymentError = 'Razorpay SDK not loaded.';
      this.isSubmitting = false;
      return;
    }

    const options: any = {
      key: this.razorpayKey,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Shyam Ji Sewa Samiti',
      description: 'Donation – Shyam Ji Sewa Samiti',
      order_id: order.id,
      prefill: {
        name: this.donorFullName.trim() || 'Anonymous',
        email: this.donorEmail || '',
        contact: this.donorMobile || '',
      },
      notes: {
        campaign_title: 'Shyam Ji Sewa Samiti',
        message: this.donorMessage.trim(),
      },
      theme: { color: '#d4af37' },
      handler: (response: any) => { this.verifyPayment(response, order); },
      modal: {
        ondismiss: () => {
          this.isSubmitting = false;
          if (!this._failedRecorded) {
            this._failedRecorded = true;
            this.recordFailedPayment(order, {
              reason: 'user_cancelled',
              description: 'User closed the payment window'
            });
          }
        }
      }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      this.isSubmitting = false;
      this._failedRecorded = true;
      this.recordFailedPayment(order, {
        reason: response?.error?.code || 'PAYMENT_FAILED',
        description: response?.error?.description || 'Payment failed',
        razorpay_payment_id: response?.error?.metadata?.payment_id || '',
        razorpay_order_id: response?.error?.metadata?.order_id || order.id,
      });
    });

    rzp.open();
  }

  verifyPayment(response: any, order: any): void {
    const paymentData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      amount: this.finalAmount,
      currency: 'INR',
      campaignId: undefined,
      donorFullName: this.sanitize(this.donorFullName.trim()),
      donorCountryCode: this.sanitize(this.donorCountryCode.trim()),
      donorMobile: this.sanitize(this.donorMobile.trim()),
      donorEmail: this.sanitize(this.donorEmail.trim()),
      donorNationality: 'India',
      donorPAN: this.sanitize(this.donorPAN.trim().toUpperCase()),
      donorAddress: this.sanitize(this.donorAddress.trim()),
      donorMessage: this.sanitize(this.donorMessage.trim()),
      campaignTitle: 'Shyam Ji Sewa Samiti',
    };

    this.paymentService.verifyPayment(paymentData).subscribe({
      next: (res: any) => {
        if (res?.success && res.receipt) {
          this._receiptData = { ...res.receipt, campaignId: undefined };
          this.lastDonation = {
            txnId: this.generateTxnId(),
            campaign: 'Shyam Ji Sewa Samiti',
            amount: this.finalAmount,
            name: this.donorFullName.trim() || 'Anonymous',
            message: this.donorMessage.trim(),
            timestamp: new Date(),
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            receiptId: res.receipt._id,
            invoiceNumber: res.receipt.invoiceNumber,
            status: 'success',
          };
          this.inlineFormStep = 'success';
        } else {
          this.paymentError = 'Payment verification failed.';
          this.recordFailedPayment(order, { reason: 'verification_failed' });
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.paymentError = 'Payment verification error.';
        this.recordFailedPayment(order, { reason: 'verification_error' });
        this.isSubmitting = false;
      }
    });
  }

  recordFailedPayment(order: any, meta: any = {}): void {
    this.lastDonation = {
      txnId: this.generateTxnId(),
      campaign: 'Shyam Ji Sewa Samiti',
      amount: this.finalAmount,
      name: this.donorFullName.trim() || 'Anonymous',
      message: this.donorMessage.trim(),
      timestamp: new Date(),
      orderId: meta.razorpay_order_id || order?.id || '',
      status: 'failed',
    };
    this.paymentError = 'Payment was not completed. Please try again.';
    this.inlineFormStep = 'success';

    const payload = {
      amount: this.finalAmount,
      currency: 'INR',
      campaignId: undefined,
      donorFullName: this.sanitize(this.donorFullName.trim()),
      donorCountryCode: this.sanitize(this.donorCountryCode.trim()),
      donorMobile: this.sanitize(this.donorMobile.trim()),
      donorEmail: this.sanitize(this.donorEmail.trim()),
      donorNationality: 'India',
      donorPAN: this.sanitize(this.donorPAN.trim().toUpperCase()),
      donorAddress: this.sanitize(this.donorAddress.trim()),
      donorMessage: this.sanitize(this.donorMessage.trim()),
      razorpay_order_id: meta.razorpay_order_id || order?.id || '',
      razorpay_payment_id: meta.razorpay_payment_id || '',
      errorCode: meta.reason || 'unknown',
      errorDescription: meta.description || 'Payment not completed',
    };

    this.paymentService.recordFailed(payload).subscribe();
  }

  generateTxnId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TXN-${ts}-${rand}`;
  }

  async downloadInvoice(): Promise<void> {
    if (this.pdfLoading || !this._receiptData) return;
    this.pdfLoading = true;
    try {
      await this.invoicePdfService.downloadPdf(this._receiptData);
    } catch {
      alert('PDF generate nahi ho payi. Please try again.');
    } finally {
      this.pdfLoading = false;
    }
  }

  donateAgain(): void {
    this.inlineFormStep = 'form';
    this.lastDonation = null;
    this._receiptData = null;
    this._failedRecorded = false;
    this.selectedAmount = null;
    this.customAmount = '';
    this.donorFullName = '';
    this.donorCountryCode = '+91';
    this.donorMobile = '';
    this.donorEmail = '';
    this.donorPAN = '';
    this.donorAddress = '';
    this.donorMessage = '';
    this.amountError = '';
    this.nameError = '';
    this.mobileError = '';
    this.panError = '';
    this.addressError = '';
    this.paymentError = '';
  }

  loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(); return; }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) { existing.addEventListener('load', () => resolve()); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });
  }

  formatINR(n: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);
  }

  // ── FAQs ───────────────────────────────────────
  faqs = [
    { question: 'Is donation secure?', answer: 'Yes, all transactions are processed through secure payment gateways.', open: true },
    { question: 'Will I receive a receipt?', answer: 'Yes, a donation receipt will be sent to your registered email.', open: false },
    { question: 'Can I donate online?', answer: 'Yes, donations can be made online through multiple payment methods.', open: false },
    { question: 'Is donation tax exempt?', answer: 'If applicable, tax exemption certificates will be provided.', open: false }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}