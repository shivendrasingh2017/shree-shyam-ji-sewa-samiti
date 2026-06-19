import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnInit, OnDestroy {
  currentBanner = 0;
  totalBanners = 3;
  private autoRotateInterval: any;

  banners = [
    
    'assets/home/banner_temple2.webp',
    'assets/home/banner3.jpg',
    'assets/home/banner2.jpg',
    
    
  ];

  ngOnInit() {
    this.startAutoRotate();
  }

  ngOnDestroy() {
    this.stopAutoRotate();
  }

  startAutoRotate() {
    this.autoRotateInterval = setInterval(() => {
      this.currentBanner = (this.currentBanner + 1) % this.totalBanners;
    }, 6000);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  goToBanner(index: number) {
    this.currentBanner = index;
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  nextBanner() {
    this.currentBanner = (this.currentBanner + 1) % this.totalBanners;
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  prevBanner() {
    this.currentBanner = (this.currentBanner - 1 + this.totalBanners) % this.totalBanners;
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  diyas = Array(12);
}







