import { Component } from '@angular/core';
import { Donation } from "../../components/donation/donation";

@Component({
  selector: 'app-donation-page',
  imports: [Donation],
  templateUrl: './donation-page.html',
  styleUrl: './donation-page.scss',
})
export class DonationPage {

  // ── Banner image path ──────────────────────────
  // Size: 1920×600px
  // Path: assets/images/ folder me rakho
  bannerImage: string = 'assets/donation/banner_donation1.jpg';
  // ───────────────────────────────────────────────

  faqs = [
    {
      question: 'Is donation secure?',
      answer:
        'Yes, all transactions are processed through secure payment gateways.',
      open: true
    },
    {
      question: 'Will I receive a receipt?',
      answer:
        'Yes, a donation receipt will be sent to your registered email.',
      open: false
    },
    {
      question: 'Can I donate online?',
      answer:
        'Yes, donations can be made online through multiple payment methods.',
      open: false
    },
    {
      question: 'Is donation tax exempt?',
      answer:
        'If applicable, tax exemption certificates will be provided.',
      open: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}