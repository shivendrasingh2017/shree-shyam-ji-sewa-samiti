import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
   currentYear = new Date().getFullYear();
   images = [
    {src: 'assets/footer/footer1.webp', alt: 'Footer Image 1'},
    {src: 'assets/footer/footer2.webp', alt: 'Footer Image 2'},
    {src: 'assets/footer/footer3.webp', alt: 'Footer Image 3'}
   ];
}
