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

  // Form state
  selectedCampaign: Campaign | null = null;
  selectedAmount: number | null = null;
  customAmount: string = '';
  donorFullName: string = '';
  donorCountryCode: string = '+91';
  donorMobile: string = '';
  donorEmail: string = '';
  donorNationality: string = 'India';
  donorPAN: string = '';
  donorAddress: string = '';
  donorMessage: string = '';

  // UI state
  step: 'select' | 'confirm' | 'success' = 'select';
  diyas = Array(7);
  modalOpen = false;
  paymentProcessing = false;
  paymentError = '';
  pdfLoading = false;

  // ── LOADER STATE ─────────────────────────────────────────────
  gatewayLoading = false;        // Razorpay script load ho raha hai
  gatewayLoadingMsg = '';        // Loader ke andar message

  // Validation errors
  amountError = '';
  nameError = '';
  mobileError = '';
  panError = '';
  addressError = '';

  // Receipt
  lastDonation: DonationRecord | null = null;
  private _receiptData: any = null;

  // Razorpay
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
    // Script silently preload karo — loader show mat karo abhi
    this.loadRazorpayScript(false);
  }

  loadRazorpayKey(): void {
    this.paymentService.getKey().subscribe({
      next: (res: any) => {
        if (res?.key) this.razorpayKey = res.key;
      },
      error: () => console.error('Failed to load Razorpay key'),
    });
  }

  // ── Razorpay script loader ────────────────────────────────────
  // showLoader = true only when user Pay Now click karta hai aur script ready nahi
  loadRazorpayScript(showLoader = true): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      // Already script tag inject hai (e.g. ngAfterViewInit se)
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      ) as HTMLScriptElement | null;

      if (existingScript) {
        if (showLoader) {
          this.gatewayLoading = true;
          this.gatewayLoadingMsg = 'Payment gateway load ho raha hai...';
          this.cdr.detectChanges();
        }
        const onLoad = () => {
          this.gatewayLoading = false;
          this.cdr.detectChanges();
          resolve();
          cleanup();
        };
        const onError = () => {
          this.gatewayLoading = false;
          this.cdr.detectChanges();
          reject(new Error('Razorpay script load failed'));
          cleanup();
        };
        const cleanup = () => {
          existingScript.removeEventListener('load', onLoad);
          existingScript.removeEventListener('error', onError);
        };
        existingScript.addEventListener('load', onLoad);
        existingScript.addEventListener('error', onError);
        return;
      }

      // Fresh script inject
      if (showLoader) {
        this.gatewayLoading = true;
        this.gatewayLoadingMsg = 'Payment gateway load ho raha hai...';
        this.cdr.detectChanges();
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.gatewayLoading = false;
        this.cdr.detectChanges();
        resolve();
      };
      script.onerror = () => {
        this.gatewayLoading = false;
        this.cdr.detectChanges();
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
          } else {
            this.selectedCampaign = null;
            this.selectedCampaignId = null;
          }
        }
      },
      error: () => {},
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
    if (event) {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('modal-overlay')) return;
    }
    this.modalOpen = false;
    document.body.style.overflow = '';
    this.step = 'select';
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
      this.amountError = 'Please select or enter a donation amount.';
      valid = false;
    } else if (amt > 100000) {
      this.amountError = 'Maximum donation per transaction is ₹1,00,000.';
      valid = false;
    }

    const fullName = this.donorFullName.trim();
    if (!fullName || fullName.length < 2) {
      this.nameError = 'Full name is required.';
      valid = false;
    } else if (fullName.length > 100) {
      this.nameError = 'Full name must be under 100 characters.';
      valid = false;
    }

    const mobile = this.donorMobile.replace(/\s+/g, '');
    if (!mobile || !/^\d{7,15}$/.test(mobile)) {
      this.mobileError = 'Enter a valid mobile number (7–15 digits).';
      valid = false;
    }

    const pan = this.donorPAN.trim().toUpperCase();
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      this.panError = 'Enter a valid PAN number (e.g. ABCDE1234F).';
      valid = false;
    }

    const address = this.donorAddress.trim();
    if (!address || address.length < 10) {
      this.addressError = 'Please enter a complete address (min 10 characters).';
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

  // ── MAIN: Pay Now click ───────────────────────────────────────
  async initiatePayment(): Promise<void> {
    if (this.paymentProcessing || this.gatewayLoading) return; // double click guard
    if (!this.validate()) return;
    if (!this.razorpayKey) {
      this.paymentError = 'Payment service not available. Please try again later.';
      return;
    }

    this.paymentProcessing = true;
    this.paymentError = '';
    this._failedRecorded = false;

    // Razorpay script ready nahi to pehle load karo (loader show hoga)
    if (!(window as any).Razorpay) {
      try {
        await this.loadRazorpayScript(true);
      } catch {
        this.paymentError = 'Payment gateway load nahi ho paya. Page refresh karke try karein.';
        this.paymentProcessing = false;
        return;
      }
    }

    // Order create karo
    this.gatewayLoadingMsg = 'Order create ho raha hai...';
    this.gatewayLoading = true;
    this.cdr.detectChanges();

    this.paymentService.createOrder(this.finalAmount).subscribe({
      next: (res: any) => {
        this.gatewayLoading = false;
        this.cdr.detectChanges();
        if (res?.success && res.order) {
          this.handleRazorpayPayment(res.order);
        } else {
          this.paymentError = 'Payment order create nahi ho paya. Please try again.';
          this.paymentProcessing = false;
        }
      },
      error: () => {
        this.gatewayLoading = false;
        this.paymentError = 'Payment initialize nahi ho paya. Please try again.';
        this.paymentProcessing = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleRazorpayPayment(order: any): void {
    const RazorpayConstructor = (window as any).Razorpay;
    if (!RazorpayConstructor) {
      this.paymentError = 'Payment gateway load nahi hua. Page refresh karein.';
      this.paymentProcessing = false;
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // CRITICAL FIX — `method` aur `config` dono BILKUL mat dena
    // Razorpay test mode mein ye dono "validate/account" API call
    // trigger karte hain jo test keys pe 500 Internal Server Error
    // deta hai. Production pe live key se automatically theek hoga,
    // lekin avoid karna best practice hai.
    // ─────────────────────────────────────────────────────────────
    const options: any = {
      key: this.razorpayKey,
      amount: order.amount,          // paise mein — backend ne set kiya
      currency: order.currency || 'INR',
      name: 'Shree Shyam Ji Sewa Samiti',
      description: `Donation: ${this.selectedCampaign?.title ?? ''}`,
      image: 'https://shyamjisewasamiti.org/assets/logo/LOGO.png',
      order_id: order.id,
      prefill: {
        name: this.donorFullName.trim() || 'Anonymous',
        email: this.donorEmail.trim() || '',
        contact: `${this.donorCountryCode || '+91'}${this.donorMobile || ''}`,
      },
      notes: {
        campaign_id: this.selectedCampaign?._id ?? '',
        campaign_title: this.selectedCampaign?.title ?? '',
        donor_message: this.donorMessage.trim(),
      },
      theme: { color: '#8b3f17' },

      // Success handler
      handler: (response: any) => {
        this._failedRecorded = true;   // ondismiss ko rok dena success pe
        this.paymentProcessing = false;
        this.verifyPayment(response, order);
      },

      modal: {
        ondismiss: () => {
          this.paymentProcessing = false;
          if (!this._failedRecorded) {
            this._failedRecorded = true;
            this.recordFailedPayment(order, {
              reason: 'user_cancelled',
              description: 'User closed payment window without completing payment',
            });
          }
          this.cdr.detectChanges();
        },
        escape: true,
        animation: true,
      },
    };

    const rzp = new RazorpayConstructor(options);

    rzp.on('payment.failed', (response: any) => {
      if (this._failedRecorded) return;
      this._failedRecorded = true;
      this.paymentProcessing = false;

      this.recordFailedPayment(order, {
        reason: response?.error?.code || 'PAYMENT_FAILED',
        description: response?.error?.description || response?.error?.reason || 'Payment failed',
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
        if (res?.success && res.receipt) {
          this.recordSuccessfulPayment(response, res.receipt);
        } else {
          this.paymentError = 'Payment verification failed. Support se contact karein.';
          this.recordFailedPayment(order, { reason: 'verification_failed' });
        }
        this.paymentProcessing = false;
      },
      error: () => {
        this.paymentError = 'Payment verification error. Support se contact karein.';
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

    this.paymentError = 'Payment complete nahi hua. Please try again.';
    this.step = 'success';

    this.paymentService.recordFailed({
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
    }).subscribe({
      next: () => {},
      error: (err) => console.error('recordFailed API error:', err),
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
    this.modalOpen = false;
    document.body.style.overflow = '';
    this.loadCampaigns();
  }

  async downloadInvoice(): Promise<void> {
    if (this.pdfLoading) return;
    if (!this._receiptData) {
      alert('Receipt data not found. Please try again.');
      return;
    }
    this.pdfLoading = true;
    this.cdr.detectChanges();
    try {
      await this.invoicePdfService.downloadPdf(this._receiptData);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generate nahi ho paya. Please try again.');
    } finally {
      this.pdfLoading = false;
      this.cdr.detectChanges();
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
    this.gatewayLoading = false;
  }

  progressPercent(c: Campaign): number {
    if (!c.goal || c.goal === 0) return 0;
    return Math.min(100, Math.round((c.raised / c.goal) * 100));
  }

  formatINR(n: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(n);
  }
}