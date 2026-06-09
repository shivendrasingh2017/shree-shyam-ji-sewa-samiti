import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-feed.html',
  styleUrl: './news-feed.scss',
})


export class NewsFeed {
  posts = [
    {
      img: 'assets/news/news1.webp', tag: 'Temple, Aastha', date: 'May 20, 2026',
      title: 'Khatu Shyam ji ke darbar me Phagun Mela ka aagaaz',
      author: 'Pt. Rakesh Sharma', avatar: 'assets/volunteers/profile.jpg'
    },
    {
      img: 'assets/news/news2.webp', tag: 'Seva, Daan', date: 'May 20, 2026',
      title: 'Samiti dwara 1100 bhakton ko bhandara',
      author: 'Mohan Lal Agarwal', avatar: 'assets/volunteers/profile.jpg'
    },
    {
      img: 'assets/news/news3.webp', tag: 'Bhajan, Satsang', date: 'May 20, 2026',
      title: 'Shyam Bhajan Sandhya — har Ekadashi shaam 7 baje',
      author: 'Vinod Sharma', avatar: 'assets/volunteers/profile.jpg'
    },
  ];
}
