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
    {src: 'assets/footer/footer1.webp', alt: 'Footer Image 1'},
    {src: 'assets/footer/footer2.webp', alt: 'Footer Image 2'},
    {src: 'assets/footer/footer3.webp', alt: 'Footer Image 3'}
   ];
}
