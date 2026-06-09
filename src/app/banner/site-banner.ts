import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './site-banner.html',
  styleUrl: './site-banner.scss',
})
export class SiteBanner implements OnInit {
  showBanner = false;

  bannerImage = 'assets/banner/banner003.jpg';

  ngOnInit(): void {
    const alreadyShown = sessionStorage.getItem('siteDonationBannerShown');

    if (!alreadyShown) {
      this.showBanner = true;
      sessionStorage.setItem('siteDonationBannerShown', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  closeBanner(): void {
    this.showBanner = false;
    document.body.style.overflow = '';
  }
}