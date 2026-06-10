import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-social-share',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-share.html',
  styleUrl: './social-share.scss',
})
export class SocialShare implements OnInit {
  isOpen = false;
  copied = false;
  isCopying = false;

  pageUrl = '';
  pageTitle = 'Shree Shyam Ji Sewa Samiti';

  private readonly liveBaseUrl = 'https://shyamjisewasamiti.org';

  constructor(
    private router: Router,
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.setCurrentUrl();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setCurrentUrl();
        this.closeShare();
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);

    if (!clickedInside && this.isOpen) {
      this.closeShare();
    }
  }

  toggleShare(event?: MouseEvent): void {
    event?.stopPropagation();
    this.isOpen = !this.isOpen;
    this.copied = false;
    this.isCopying = false;
  }

  closeShare(): void {
    this.isOpen = false;
    this.copied = false;
    this.isCopying = false;
  }

  private setCurrentUrl(): void {
    const path =
      this.document.location.pathname +
      this.document.location.search +
      this.document.location.hash;

    this.pageUrl = `${this.liveBaseUrl}${path}`;
    this.pageTitle = this.document.title || 'Shree Shyam Ji Sewa Samiti';
  }

  async copyUrl(event?: MouseEvent): Promise<void> {
  event?.stopPropagation();

  if (this.isCopying) return;

  this.isCopying = true;
  this.copied = false;

  try {
    await this.copyToClipboard();

    this.isCopying = false;
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1800);

  } catch (error) {
    this.isCopying = false;
    console.error(error);
  }
}

  private async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.pageUrl);
    } catch {
      const input = this.document.createElement('input');
      input.value = this.pageUrl;
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      input.style.top = '0';

      this.document.body.appendChild(input);
      input.focus();
      input.select();
      this.document.execCommand('copy');
      this.document.body.removeChild(input);
    }
  }

  async nativeShare(event?: MouseEvent): Promise<void> {
    event?.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: this.pageTitle,
          text: 'Shree Shyam Ji Sewa Samiti ki seva aur donation campaign dekhein.',
          url: this.pageUrl,
        });
      } catch {
        // User cancelled native share.
      }
    } else {
      await this.copyUrl(event);
    }
  }

  shareWhatsapp(event?: MouseEvent): void {
    event?.stopPropagation();

    const text = encodeURIComponent(
      `Shree Shyam Ji Sewa Samiti\nSeva, Bhandara aur Donation ke liye visit karein:\n${this.pageUrl}`
    );

    this.openShareUrl(`https://wa.me/?text=${text}`);
  }

  shareFacebook(event?: MouseEvent): void {
    event?.stopPropagation();

    const url = encodeURIComponent(this.pageUrl);
    this.openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  }

  shareTwitter(event?: MouseEvent): void {
    event?.stopPropagation();

    const text = encodeURIComponent('Shree Shyam Ji Sewa Samiti');
    const url = encodeURIComponent(this.pageUrl);

    this.openShareUrl(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  }

  shareTelegram(event?: MouseEvent): void {
    event?.stopPropagation();

    const url = encodeURIComponent(this.pageUrl);
    const text = encodeURIComponent('Shree Shyam Ji Sewa Samiti');

    this.openShareUrl(`https://t.me/share/url?url=${url}&text=${text}`);
  }

  private openShareUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer,width=650,height=520');
  }
}