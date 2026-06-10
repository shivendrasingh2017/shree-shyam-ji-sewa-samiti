import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
   currentYear = new Date().getFullYear();
  images = [
  {
    src: 'assets/footer/footer1.jpg',
    alt: 'Food Seva',
    date: 'May 20, 2026',
    title: 'Baba Shyam ki kripa se naya adhyay shuru'
  },
  {
    src: 'assets/footer/footer2.jpg',
    alt: 'Bhandara Seva',
    date: 'May 25, 2026',
    title: 'Shyam Bhajan Sandhya mein bhakton ne liya adhyatmik anand'
  },
  {
    src: 'assets/footer/footer3.jpg',
    alt: 'Bhajan Sandhya',
    date: 'June 01, 2026',
    title: 'Shyam Bhajan Sandhya har Ekadashi shaam 7 baje'
  }
];
}
