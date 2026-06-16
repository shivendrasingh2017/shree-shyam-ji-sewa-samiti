import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import * as AOS from 'aos';

import { Abouts } from '../../components/abouts/abouts';
import { Donation } from '../../components/donation/donation';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, Abouts, Donation],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit, AfterViewInit {
  readonly heroBanner = 'assets/home/banner_temple1.webp';
  readonly aboutImg = 'assets/home/khatu.jpg';
  readonly whoWeAreImg = 'assets/home/banner_temple1.webp';

  stats = [
    { value: '5000+', title: 'Families Helped' },
    { value: '200+', title: 'Events Organized' },
    { value: '1000+', title: 'Volunteers' },
    { value: '50000+', title: 'Meals Distributed' },
  ];

  services = [
    'Religious Activities',
    'Food Distribution',
    'Education Support',
    'Medical Assistance',
    'Festival Celebrations',
    'Gau Sewa',
  ];

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.title.setTitle('About Us | Shree Shyam Ji Sewa Samiti');

    this.meta.updateTag({
      name: 'description',
      content:
        'Learn about Shree Shyam Ji Sewa Samiti, our mission, vision, food seva, bhandara, bhajan sandhya, religious activities and social welfare work.',
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'About Shree Shyam Ji Sewa Samiti, Khatu Shyam Ji, Shyam Ji Sewa Samiti, food seva, bhandara, bhajan sandhya, religious activities, social welfare',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'About Us | Shree Shyam Ji Sewa Samiti',
    });

    this.meta.updateTag({
      property: 'og:description',
      content:
        'Know more about Shree Shyam Ji Sewa Samiti and our seva, bhakti, bhandara, donation and social welfare initiatives.',
    });

    this.meta.updateTag({
      property: 'og:url',
      content: 'https://shyamjisewasamiti.org/about',
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website',
    });

    AOS.init({ duration: 800, once: true, offset: 100 });
  }

  ngAfterViewInit(): void {
    setTimeout(() => AOS.refreshHard(), 300);
  }
}