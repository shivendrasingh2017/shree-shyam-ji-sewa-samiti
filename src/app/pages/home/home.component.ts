import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from "../../components/hero/hero";
import { Features } from '../../components/features/features';
import { About } from '../about/about';
import { ContactBar } from '../contact-bar/contact-bar';

import { LiveBroadcast } from "../../components/live-broadcast/live-broadcast";
import { OurPuja } from "../../components/our-puja/our-puja";
import { Gallery } from "../../components/gallery/gallery";
import { Volunteers } from "../../components/volunteers/volunteers";
import { Testimonials } from "../../components/testimonials/testimonials";
import { NewsFeed } from "../../components/news-feed/news-feed";
import { HowWeHelpComponent } from "../../components/how-we-help/how-we-help";
import { Donation } from "../../components/donation/donation";
import { Abouts } from "../../components/abouts/abouts";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, Hero, Features, ContactBar, LiveBroadcast, OurPuja, Gallery, Volunteers, Testimonials, NewsFeed, HowWeHelpComponent, Donation, Abouts],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}



