import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as AOS from 'aos';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {

  // ── Form ─────────────────────────────────────────────────────────────────────
  contactForm!: FormGroup;
  submitted     = false;
  isSubmitting  = false;
  successMsg    = '';

  // ── Donation ──────────────────────────────────────────────────────────────────
  donationAmounts = [100, 251, 501, 1001, 2101, 5100];
  selectedAmount  = 501;
  customAmount: number | null = null;

  // ── Map ───────────────────────────────────────────────────────────────────────
  /**
   * Replace the officeAddress with your actual NGO address.
   * Replace YOUR_GOOGLE_MAPS_API_KEY with your Maps Embed API key.
   * OR use the plain iframe src from Google Maps -> Share -> Embed a map.
   */
  private readonly officeAddress = 'Shree+Shyam+Ji+Sewa+Samiti';
  mapUrl!: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Initialise AOS scroll animations
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });

    // Build reactive form
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

    // Sanitise Google Maps embed URL
    const rawUrl =
      `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${this.officeAddress}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  // ── Convenience getter ────────────────────────────────────────────────────────
  get f() { return this.contactForm.controls; }

  // ── Form submit ───────────────────────────────────────────────────────────────
  onSubmit(): void {
    this.submitted  = true;
    this.successMsg = '';

    if (this.contactForm.invalid) { return; }

    this.isSubmitting = true;

    /**
     * Replace this mock timeout with your actual HTTP service call.
     * e.g. this.http.post('/api/contact', this.contactForm.value).subscribe(...)
     */
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMsg   =
        'Your message has been sent! We will get back to you within 24 hours.';
      this.contactForm.reset();
      this.submitted = false;
      setTimeout(() => (this.successMsg = ''), 6000);
    }, 1500);
  }

  // ── Donation amount selector ──────────────────────────────────────────────────
  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount   = null;
  }

  // ── Copy to clipboard ─────────────────────────────────────────────────────────
  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => alert('Copied: ' + text))
      .catch(() => {});
  }
}