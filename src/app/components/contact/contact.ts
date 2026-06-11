import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {
  isLoading = false;
  mapUrl!: SafeResourceUrl;

  private readonly latitude = 28.616600927748127;
  private readonly longitude = 77.38155745767135;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const rawUrl =
      `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&t=k&z=17&output=embed`;

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  scrollToMap(): void {
    document.getElementById('map-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}