import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../services/campaign';
import { PaymentService } from '../../services/payment';
import { InvoicePdf } from '../../services/invoice-pdf';

export interface Campaign {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  icon: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  active: boolean;
  createdAt?: string;
}

export interface DonationRecord {
  txnId: string;
  campaign: string;
  amount: number;
  name: string;
  message: string;
  timestamp: Date;
  paymentId?: string;
  orderId?: string;
  receiptId?: string;
  invoiceNumber?: string;
  status: 'pending' | 'success' | 'failed';
}

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.html',
  styleUrls: ['./donation.scss'],
})
export class Donation implements OnInit, AfterViewInit {
  campaigns: Campaign[] = [];
  visibleCount = 6;
  selectedCampaignId: string | null = null;

  presetAmounts: number[] = [51, 101, 501, 1001, 5001];

  selectedCampaign: Campaign | null = null;
  selectedAmount: number | null = null;
  customAmount = '';
  donorFullName = '';
  donorCountryCode = '+91';
  donorMobile = '';
  donorEmail = '';
  donorNationality = 'India';
  donorPAN = '';
  donorAddress = '';
  donorMessage = '';

  step: 'select' | 'confirm' | 'success' = 'select';
  modalOpen = false;
  paymentProcessing = false;
  paymentError = '';
  pdfLoading = false;

  gatewayLoading = false;
  gatewayLoadingMsg = '';

  amountError = '';
  nameError = '';
  mobileError = '';
  panError = '';
  addressError = '';

  lastDonation: DonationRecord | null = null;
  private _receiptData: any = null;

  razorpayKey = '';
  private _failedRecorded = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private campaignService: CampaignService,
    private paymentService: PaymentService,
    private invoicePdfService: InvoicePdf
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadRazorpayKey();
  }

  ngAfterViewInit(): void {
    this.loadRazorpayScript(false);
  }

  private showLoader(message: string): void {
    this.gatewayLoading = true;
    this.gatewayLoadingMsg = message;
    this.cdr.detectChanges();
  }

  private hideLoader(): void {
    this.gatewayLoading = false;
    this.gatewayLoadingMsg = '';
    this.cdr.detectChanges();
  }

  loadRazorpayKey(): void {
    this.showLoader('Payment service check ho raha hai...');
    this.paymentService.getKey().subscribe({
      next: (res: any) => {
        if (res?.key) this.razorpayKey = res.key;
        this.hideLoader();
      },
      error: () => {
        this.hideLoader();
        console.error('Failed to load Razorpay key');
      },
    });
  }

  loadRazorpayScript(showLoader = true): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      ) as HTMLScriptElement | null;

      if (existingScript) {
        if (showLoader) this.showLoader('Payment gateway load ho raha hai...');

        existingScript.addEventListener('load', () => {
          if (showLoader) this.hideLoader();
          resolve();
        });

        existingScript.addEventListener('error', () => {
          if (showLoader) this.hideLoader();
          reject(new Error('Razorpay script load failed'));
        });

        return;
      }

      if (showLoader) this.showLoader('Payment gateway load ho raha hai...');

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        if (showLoader) this.hideLoader();
        resolve();
      };

      script.onerror = () => {
        if (showLoader) this.hideLoader();
        reject(new Error('Razorpay script load failed'));
      };

      document.body.appendChild(script);
    });
  }

  private calculateRemainingDays(campaign: Campaign): number {
    if (typeof campaign.daysLeft !== 'number') return 0;
    if (!campaign.createdAt) return Math.max(0, campaign.daysLeft);

    const createdAt = new Date(campaign.createdAt);
    if (Number.isNaN(createdAt.getTime())) return Math.max(0, campaign.daysLeft);

    const elapsedDays = Math.floor((Date.now() - createdAt.getTime()) / 86400000);
    return Math.max(0, campaign.daysLeft - elapsedDays);
  }

  loadCampaigns(): void {
    this.showLoader('Campaigns load ho rahe hain...');

    this.campaignService.list().subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.campaigns = (res.data || [])
            .filter((c: Campaign) => c.active === true)
            .map((c: Campaign) => ({
              ...c,
              daysLeft: this.calculateRemainingDays(c),
            }));

          if (this.campaigns.length) {
            this.selectCampaign(this.campaigns[0], false);
          }
        }

        this.hideLoader();
      },
      error: () => {
        this.hideLoader();
      },
    });
  }

  selectCampaign(c: Campaign, openModal = true): void {
    this.selectedCampaign = c;
    this.selectedCampaignId = c._id || null;
    this.resetForm();

    if (openModal) {
      this.step = 'select';
      this.modalOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  isSelectedCampaign(c: Campaign): boolean {
    return !!(c._id && this.selectedCampaignId && c._id === this.selectedCampaignId);
  }

  closeModal(event: MouseEvent | null): void {
    if (this.gatewayLoading || this.paymentProcessing || this.pdfLoading) return;

    if (event) {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('modal-overlay')) return;
    }

    this.modalOpen = false;
    this.step = 'select';
    document.body.style.overflow = '';
  }

  selectPreset(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = '';
    this.amountError = '';
  }

  onCustomAmountChange(): void {
    this.selectedAmount = null;
    this.amountError = '';
  }

  get finalAmount(): number {
    if (this.selectedAmount) return this.selectedAmount;
    const v = parseFloat(this.customAmount);
    return isNaN(v) ? 0 : v;
  }

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
      this.nameError = 'Full name is required.';
      valid = false;
    }

    const mobile = this.donorMobile.replace(/\s+/g, '');
    if (!mobile || !/^\d{7,15}$/.test(mobile)) {
      this.mobileError = 'Enter valid mobile number.';
      valid = false;
    }

    const pan = this.donorPAN.trim().toUpperCase();
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      this.panError = 'Enter valid PAN number.';
      valid = false;
    }

    const address = this.donorAddress.trim();
    if (!address || address.length < 10) {
      this.addressError = 'Please enter valid address.';
      valid = false;
    }

    return valid;
  }

  sanitize(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  proceedToConfirm(): void {
    if (!this.validate()) return;
    this.step = 'confirm';
  }

  async initiatePayment(): Promise<void> {
    if (!this.validate()) return;

    if (!this.razorpayKey) {
      this.paymentError = 'Payment service not available. Please try again later.';
      return;
    }

    this.paymentProcessing = true;
    this.paymentError = '';
    this._failedRecorded = false;

    try {
      await this.loadRazorpayScript(true);

      this.showLoader('Secure order create ho raha hai...');

      this.paymentService.createOrder(this.finalAmount).subscribe({
        next: (res: any) => {
          this.hideLoader();

          if (res?.success && res.order) {
            this.handleRazorpayPayment(res.order);
          } else {
            this.paymentError = 'Failed to create payment order.';
            this.paymentProcessing = false;
          }
        },
        error: () => {
          this.hideLoader();
          this.paymentError = 'Failed to initialize payment.';
          this.paymentProcessing = false;
        },
      });
    } catch {
      this.hideLoader();
      this.paymentError = 'Payment gateway load nahi ho paya.';
      this.paymentProcessing = false;
    }
  }

  handleRazorpayPayment(order: any): void {
    const Razorpay = (window as any).Razorpay;

    if (!Razorpay) {
      this.paymentError = 'Razorpay SDK not loaded.';
      this.paymentProcessing = false;
      return;
    }

    const options: any = {
      key: this.razorpayKey,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Shyam Ji Sewa Samiti',
      description: `Donation to ${this.selectedCampaign?.title || 'Campaign'}`,
      order_id: order.id,

      prefill: {
        name: this.donorFullName.trim() || 'Anonymous',
        email: this.donorEmail || '',
        contact: this.donorMobile || '',
      },

      notes: {
        campaign_id: this.selectedCampaign?._id || '',
        campaign_title: this.selectedCampaign?.title || '',
        message: this.donorMessage.trim(),
      },

      theme: {
        color: '#d4af37',
      },

      handler: (response: any) => {
        this.verifyPayment(response, order);
      },

      modal: {
        ondismiss: () => {
          this.paymentProcessing = false;

          if (!this._failedRecorded) {
            this._failedRecorded = true;
            this.recordFailedPayment(order, {
              reason: 'user_cancelled',
              description: 'User closed the payment window without completing payment',
            });
          }
        },
      },
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      this.paymentProcessing = false;
      this._failedRecorded = true;

      this.recordFailedPayment(order, {
        reason: response?.error?.code || 'PAYMENT_FAILED',
        description:
          response?.error?.description ||
          response?.error?.reason ||
          'Payment failed',
        razorpay_payment_id: response?.error?.metadata?.payment_id || '',
        razorpay_order_id: response?.error?.metadata?.order_id || order.id,
      });
    });

    rzp.open();
  }

  verifyPayment(response: any, order: any): void {
    this.showLoader('Payment verify ho raha hai...');

    const paymentData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      amount: this.finalAmount,
      currency: 'INR',
      campaignId: this.selectedCampaign?._id,
      donorFullName: this.sanitize(this.donorFullName.trim()),
      donorCountryCode: this.sanitize(this.donorCountryCode.trim()),
      donorMobile: this.sanitize(this.donorMobile.trim()),
      donorEmail: this.sanitize(this.donorEmail.trim()),
      donorNationality: this.sanitize(this.donorNationality.trim()),
      donorPAN: this.sanitize(this.donorPAN.trim().toUpperCase()),
      donorAddress: this.sanitize(this.donorAddress.trim()),
      donorMessage: this.sanitize(this.donorMessage.trim()),
    };

    this.paymentService.verifyPayment(paymentData).subscribe({
      next: (res: any) => {
        this.hideLoader();

        if (res?.success && res.receipt) {
          this.recordSuccessfulPayment(response, res.receipt);
        } else {
          this.paymentError = 'Payment verification failed.';
          this.recordFailedPayment(order, { reason: 'verification_failed' });
        }

        this.paymentProcessing = false;
      },
      error: () => {
        this.hideLoader();
        this.paymentError = 'Payment verification error.';
        this.recordFailedPayment(order, { reason: 'verification_error' });
        this.paymentProcessing = false;
      },
    });
  }

  recordSuccessfulPayment(response: any, receipt: any): void {
    this._receiptData = {
      ...receipt,
      campaignId: receipt.campaignId || this.selectedCampaign,
    };

    this.lastDonation = {
      txnId: this.generateTxnId(),
      campaign: this.selectedCampaign?.title || '',
      amount: this.finalAmount,
      name: this.donorFullName.trim() || 'Anonymous',
      message: this.donorMessage.trim(),
      timestamp: new Date(),
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      receiptId: receipt._id,
      invoiceNumber: receipt.invoiceNumber,
      status: 'success',
    };

    this.step = 'success';
    this.cdr.detectChanges();
  }

  recordFailedPayment(
    order: any,
    meta: {
      reason?: string;
      description?: string;
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
    } = {}
  ): void {
    this.lastDonation = {
      txnId: this.generateTxnId(),
      campaign: this.selectedCampaign?.title || '',
      amount: this.finalAmount,
      name: this.donorFullName.trim() || 'Anonymous',
      message: this.donorMessage.trim(),
      timestamp: new Date(),
      orderId: meta.razorpay_order_id || order?.id || '',
      status: 'failed',
    };

    this.paymentError = 'Payment was not completed. Please try again.';
    this.step = 'success';

    const payload = {
      amount: this.finalAmount,
      currency: 'INR',
      campaignId: this.selectedCampaign?._id,
      donorFullName: this.sanitize(this.donorFullName.trim()),
      donorCountryCode: this.sanitize(this.donorCountryCode.trim()),
      donorMobile: this.sanitize(this.donorMobile.trim()),
      donorEmail: this.sanitize(this.donorEmail.trim()),
      donorNationality: this.sanitize(this.donorNationality.trim()),
      donorPAN: this.sanitize(this.donorPAN.trim().toUpperCase()),
      donorAddress: this.sanitize(this.donorAddress.trim()),
      donorMessage: this.sanitize(this.donorMessage.trim()),
      razorpay_order_id: meta.razorpay_order_id || order?.id || '',
      razorpay_payment_id: meta.razorpay_payment_id || '',
      errorCode: meta.reason || 'unknown',
      errorDescription: meta.description || 'Payment not completed',
    };

    this.showLoader('Failed payment record save ho raha hai...');

    this.paymentService.recordFailed(payload).subscribe({
      next: () => this.hideLoader(),
      error: () => this.hideLoader(),
    });

    this.cdr.detectChanges();
  }

  generateTxnId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TXN-${ts}-${rand}`;
  }

  donateAgain(): void {
    this.step = 'select';
    this.lastDonation = null;
    this._receiptData = null;
    this._failedRecorded = false;
    this.resetForm();
  }

  async downloadInvoice(): Promise<void> {
    if (this.pdfLoading) return;

    if (!this._receiptData) {
      alert('Receipt data not found. Please try again.');
      return;
    }

    this.pdfLoading = true;
    this.showLoader('Donation receipt PDF generate ho rahi hai...');

    try {
      await this.invoicePdfService.downloadPdf(this._receiptData);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generate nahi ho payi. Please try again.');
    } finally {
      this.pdfLoading = false;
      this.hideLoader();
    }
  }

  resetForm(): void {
    this.selectedAmount = null;
    this.customAmount = '';
    this.donorFullName = '';
    this.donorCountryCode = '+91';
    this.donorMobile = '';
    this.donorEmail = '';
    this.donorNationality = 'India';
    this.donorPAN = '';
    this.donorAddress = '';
    this.donorMessage = '';
    this.amountError = '';
    this.nameError = '';
    this.mobileError = '';
    this.panError = '';
    this.addressError = '';
    this.paymentError = '';
    this.pdfLoading = false;
    this._receiptData = null;
    this._failedRecorded = false;
  }

  progressPercent(c: Campaign): number {
    if (!c.goal) return 0;
    return Math.min(100, Math.round((c.raised / c.goal) * 100));
  }

  formatINR(n: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(n || 0);
  }
}