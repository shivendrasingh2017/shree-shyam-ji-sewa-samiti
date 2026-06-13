import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HelpCard {
  icon: string;
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
      title: 'Food Seva & Bhandara',
      desc: 'Shyam Ji Sewa Samiti bhakton aur zaruratmand logon ke liye food seva, bhandara aur prasad vitran ka ayojan karti hai.',
      variant: 'mauve',
      link: '/donation',
    },
    {
      icon: 'assets/svg/puja.svg',
      title: 'Puja, Aarti & Bhajan',
      desc: 'Hamari samiti dharmik karyakram, Shyam Aarti, Bhajan Sandhya, Ekadashi Paath aur seva programs ka ayojan karti hai.',
      variant: 'red',
      link: '/aarti',
    },
    {
      icon: 'assets/svg/pooja.svg',
      title: 'Donation & Social Help',
      desc: 'Aapka donation seva, dharmik karya, food distribution aur samaj kalyan ke kaamon me lagaya jata hai.',
      variant: 'white',
      link: '/donation',
    },
  ];
}