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

  private readonly address = 'H.No.24, Sagar Parisar, Gulmohar, Huzur, Bhopal, Madhya Pradesh 462039';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const rawUrl =
      `https://maps.google.com/maps?q=${encodeURIComponent(this.address)}&t=k&z=16&output=embed`;

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