import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as AOS from 'aos';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule],
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
   * Shree ShyamJi Sewa Samiti - NGO Office
   * Blog C-23 Sector 63 Noida U.P.
   * Coordinates: 28.616600927748127, 77.38155745767135
   */
  private readonly officeAddress = 'Shree ShyamJi Sewa Samiti, Blog C-23 Sector 63 Noida U.P.';
  private readonly latitude = 28.616600927748127;
  private readonly longitude = 77.38155745767135;
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

    // Sanitise Google Maps embed URL using coordinates
    const rawUrl =
      `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&t=k&z=17&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

   scrollToForm(): void {

    const element =
      document.getElementById('contact-form');

    if (element) {

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }
  }
  scrollToMap(): void {

  const element =
    document.getElementById('map-section');

  if (element) {

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }
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