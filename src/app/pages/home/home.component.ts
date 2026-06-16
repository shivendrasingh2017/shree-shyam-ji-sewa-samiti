import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { LiveBroadcast } from '../../components/live-broadcast/live-broadcast';
import { OurPuja } from '../../components/our-puja/our-puja';
import { Gallery } from '../../components/gallery/gallery';
import { Volunteers } from '../../components/volunteers/volunteers';
import { Testimonials } from '../../components/testimonials/testimonials';
import { NewsFeed } from '../../components/news-feed/news-feed';
import { HowWeHelpComponent } from '../../components/how-we-help/how-we-help';
import { Donation } from '../../components/donation/donation';
import { Abouts } from '../../components/abouts/abouts';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    Hero,
    Features,
    LiveBroadcast,
    OurPuja,
    Gallery,
    Volunteers,
    Testimonials,
    NewsFeed,
    HowWeHelpComponent,
    Donation,
    Abouts,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.title.setTitle(
      'Shree Shyam Ji Sewa Samiti | Khatu Shyam Seva, Donation & Bhandara'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Shree Shyam Ji Sewa Samiti is dedicated to Khatu Shyam Ji seva, bhandara, food seva, bhajan sandhya, aarti, donation campaigns and social welfare activities.',
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'Shree Shyam Ji Sewa Samiti, Khatu Shyam Ji, Shyam Ji Sewa Samiti, donation, bhandara, food seva, aarti, bhajan sandhya, seva samiti',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'Shree Shyam Ji Sewa Samiti | Khatu Shyam Seva & Donation',
    });

    this.meta.updateTag({
      property: 'og:description',
      content:
        'Support Shree Shyam Ji Sewa Samiti for bhandara, food seva, dharmik activities and social welfare.',
    });

    this.meta.updateTag({
      property: 'og:url',
      content: 'https://shyamjisewasamiti.org/',
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website',
    });
  }
}