import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiveBroadcast } from "../../components/live-broadcast/live-broadcast";

@Component({
  selector: 'app-aarti',
  imports: [CommonModule, LiveBroadcast, RouterModule],
  templateUrl: './aarti.html',
  styleUrls: ['./aarti.scss'],
})
export class Aarti  {

  isLive = true;

  heroImage =
    'assets/home/banner_temple1.webp';

  aartiTimings = [
    { name: 'Mangla Aarti', time: '5:00 AM' },
    { name: 'Shringar Aarti', time: '8:00 AM' },
    { name: 'Rajbhog Aarti', time: '12:00 PM' },
    { name: 'Sandhya Aarti', time: '7:00 PM' },
    { name: 'Shayan Aarti', time: '9:00 PM' }
  ];

  aartis = [
    {
      title: 'Khatu Shyam Ji Aarti',
      pdf: 'assets/pdf/khatu-shyam-aarti.pdf'
    },
    {
      title: 'Om Jai Jagdish Hare',
      pdf: 'assets/pdf/om-jai-jagdish-hare.pdf'
    },
    {
      title: 'Hanuman Ji Aarti',
      pdf: 'assets/pdf/hanuman-aarti.pdf'
    }
  ];

  benefits = [
    {
      icon: 'fa-solid fa-om',
      title: 'Spiritual Peace',
      description:
        'Experience inner peace and devotion through daily Aarti.'
    },
    {
      icon: 'fa-solid fa-sun',
      title: 'Positive Energy',
      description:
        'Fill your life with positivity and divine vibrations.'
    },
    {
      icon: 'fa-solid fa-hands-praying',
      title: 'Divine Blessings',
      description:
        'Seek blessings of Khatu Shyam Ji and prosperity.'
    },
    {
      icon: 'fa-solid fa-people-group',
      title: 'Community Participation',
      description:
        'Join devotees and celebrate together in devotion.'
    }
  ];

  readLyrics(title: string) {
    alert(`Open lyrics for ${title}`);
  }

  printAarti() {
    window.print();
  }
}