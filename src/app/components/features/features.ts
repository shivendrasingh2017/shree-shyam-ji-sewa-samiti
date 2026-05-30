import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  items = [
    { icon: 'assets/svg/temple.svg', title: 'Temple', desc: 'Temple is a spiritual place where devotees come for peace, prayer, and blessings of Khatu Shyam Ji. We organize daily aarti, bhajan, and religious programs to spread faith and positivity. Our temple promotes unity, devotion, and social service for all people in the community' },
    { icon: 'assets/svg/pooja.svg', title: 'Puja', desc: 'Organizes special puja, havan, bhajan sandhya, and spiritual ceremonies throughout the year. Devotees participate with devotion to seek blessings, happiness, and peace. Our puja rituals are performed with traditional values, creating a divine and positive atmosphere for everyone visiting the temple.' },
    { icon: 'assets/svg/donation.svg', title: 'Donation', desc: 'Accepts donations to support temple activities, food distribution, and social welfare programs. Every contribution helps needy families, religious events, and community services. Your donation supports seva, humanity, and spiritual activities while helping us continue our mission of faith and social service.' },
  ];
}







