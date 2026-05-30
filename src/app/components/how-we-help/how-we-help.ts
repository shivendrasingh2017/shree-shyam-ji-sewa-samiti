import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HelpCard {
  icon: string;       // SVG path or emoji-style asset
  title: string;
  desc: string;
  variant: 'mauve' | 'red' | 'white';
  link: string;
}

@Component({
  selector: 'app-how-we-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-we-help.html',
  styleUrls: ['./how-we-help.scss'],
})
export class HowWeHelpComponent {
  cards: HelpCard[] = [
    {
      icon: 'assets/svg/temple.svg',
      title: 'About Temple',
      desc: 'Temple is place where hindu worship consectetur adipisicing elit, sed do',
      variant: 'mauve',
      link: '/about',
    },
    {
      icon: 'assets/svg/puja.svg',
      title: 'Our Pandit',
      desc: 'Temple is place where hindu worship consectetur adipisicing elit, sed do',
      variant: 'red',
      link: '/puja',
    },
    {
      icon: 'assets/svg/pooja.svg',
      title: 'Prayers',
      desc: 'Temple is place where hindu worship consectetur adipisicing elit, sed do',
      variant: 'white',
      link: '/aarti',
    },
  ];
}
