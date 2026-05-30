import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../services/campaign';
import { PaymentService } from '../../services/payment';

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

  // Validation errors
  amountError = '';
  nameError = '';
  mobileError = '';
  panError = '';
  addressError = '';

  // Receipt
  lastDonation: DonationRecord | null = null;

  // Razorpay
  razorpayKey = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private campaignService: CampaignService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadRazorpayKey();
  }

  ngAfterViewInit(): void {
    this.loadRazorpayScript();
  }

  loadRazorpayKey(): void {
    this.paymentService.getKey().subscribe((res: any) => {
      if (res && res.key) {
        this.razorpayKey = res.key;
      }
    }, () => {
      console.error('Failed to load Razorpay key');
    });
  }

  loadRazorpayScript(): void {
    if ((window as any).Razorpay) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  loadCampaigns(): void {
    this.campaignService.list().subscribe((res: any) => {
      if (res && res.success) {
        this.campaigns = res.data;
        if (this.campaigns.length) this.selectCampaign(this.campaigns[0], false);
      }
    }, () => {});
  }

  selectCampaign(c: Campaign, openModal = true): void {
    this.campaigns.forEach(x => (x.active = false));
    c.active = true;
    this.selectedCampaign = c;
    this.resetForm();
    if (openModal) {
      this.step = 'select';
      this.modalOpen = true;
      document.body.style.overflow = 'hidden';
    }
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
      this.mobileError = 'Enter a valid mobile number (7-15 digits).';
      valid = false;
    }

    const pan = this.donorPAN.trim().toUpperCase();
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      this.panError = 'Enter a valid PAN number.';
      valid = false;
    }

    const address = this.donorAddress.trim();
    if (!address || address.length < 10) {
      this.addressError = 'Please enter a valid address.';
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

  initiatePayment(): void {
    if (!this.validate()) return;
    if (!this.razorpayKey) {
      this.paymentError = 'Payment service not available. Please try again later.';
      return;
    }

    this.paymentProcessing = true;
    this.paymentError = '';

    this.paymentService.createOrder(this.finalAmount).subscribe(
      (res: any) => {
        if (res && res.success && res.order) {
          this.handleRazorpayPayment(res.order);
        } else {
          this.paymentError = 'Failed to create payment order';
          this.paymentProcessing = false;
        }
      },
      () => {
        this.paymentError = 'Failed to initialize payment';
        this.paymentProcessing = false;
      }
    );
  }

  handleRazorpayPayment(order: any): void {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      this.paymentError = 'Razorpay SDK not loaded';
      this.paymentProcessing = false;
      return;
    }

    const logoUrl = 'https://shyamjisewasamiti.org/assets/logo/logo.svg';
    const options = {
      key: this.razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Shree Shyam Ji Sewa Samiti',
      description: `Donation to ${this.selectedCampaign?.title}`,
      image: logoUrl,
      order_id: order.id,
      prefill: {
        name: this.donorFullName.trim() || 'Anonymous',
        email: this.donorEmail || '',
        contact: (this.donorCountryCode || '') + (this.donorMobile || ''),
      },
      notes: {
        campaign_id: this.selectedCampaign?._id,
        campaign_title: this.selectedCampaign?.title,
        message: this.donorMessage.trim(),
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: true,
        bank_transfer: true
      },
      config: {
        display: {
          name: 'Shree Shyam Ji Sewa Samiti',
          description: 'Support the community with secure UPI, QR, card, or bank payment.',
          image: logoUrl
        }
      },
      theme: { color: '#667eea' },
      handler: (response: any) => this.verifyPayment(response, order),
      modal: { ondismiss: () => this.recordFailedPayment(order) }
    };

    const rzp = new Razorpay(options);
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

    this.paymentService.verifyPayment(paymentData).subscribe(
      (res: any) => {
        if (res && res.success && res.receipt) {
          this.recordSuccessfulPayment(response, res.receipt);
        } else {
          this.paymentError = 'Payment verification failed';
          this.recordFailedPayment(order, { reason: 'verification_failed' });
        }
        this.paymentProcessing = false;
      },
      () => {
        this.paymentError = 'Payment verification error';
        this.recordFailedPayment(order, { reason: 'verification_error' });
        this.paymentProcessing = false;
      }
    );
  }

  recordSuccessfulPayment(response: any, receipt: any): void {
    const txnId = this.generateTxnId();
    this.lastDonation = {
      txnId,
      campaign: this.selectedCampaign?.title || '',
      amount: this.finalAmount,
      name: this.donorFullName.trim() || 'Anonymous',
      message: this.donorMessage.trim(),
      timestamp: new Date(),
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      receiptId: receipt._id,
      invoiceNumber: receipt.invoiceNumber,
      status: 'success'
    };

    this.loadCampaigns();
    this.step = 'success';
    this.cdr.detectChanges();
  }

  recordFailedPayment(order: any, meta: any = {}): void {
    this.lastDonation = {
      txnId: this.generateTxnId(),
      campaign: this.selectedCampaign?.title || '',
      amount: this.finalAmount,
      name: this.donorFullName.trim() || 'Anonymous',
      message: this.donorMessage.trim(),
      timestamp: new Date(),
      orderId: order.id,
      status: 'failed'
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
      razorpay_order_id: order.id,
      errorCode: meta.reason || 'cancelled',
      errorDescription: meta.description || 'User dismissed or payment failed'
    };

    this.paymentService.recordFailed(payload).subscribe(()=>{}, ()=>{});
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
    this.resetForm();
    this.modalOpen = false;
    document.body.style.overflow = '';
  }

  downloadInvoice(): void {
    if (!this.lastDonation?.receiptId) return;
    const url = `https://api.shyamjisewasamiti.org/api/receipts/${this.lastDonation.receiptId}/invoice`;
    window.open(url, '_blank');
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
  }

  progressPercent(c: Campaign): number {
    return Math.min(100, Math.round((c.raised / c.goal) * 100));
  }

  formatINR(n: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
  }
}
