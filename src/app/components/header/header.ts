import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
   open = signal(false);
  toggle() { this.open.set(!this.open()); }
  close() { this.open.set(false); }
  menu = ['HOME', 'ABOUT', 'BLOG', 'PAGES', 'SERVICE', 'DONATION', 'SHOP', 'CONTACT'];
}





