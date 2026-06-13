import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
})
export class CookieConsent implements OnInit {
  showCookie = false;

  ngOnInit(): void {
    const accepted = localStorage.getItem('cookieConsentAccepted');

    if (!accepted) {
      setTimeout(() => {
        this.showCookie = true;
      }, 800);
    }
  }

  acceptCookies(): void {
    localStorage.setItem('cookieConsentAccepted', 'true');
    this.showCookie = false;
  }

  closeCookie(): void {
    this.showCookie = false;
  }
}