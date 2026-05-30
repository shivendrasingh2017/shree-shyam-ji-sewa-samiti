import { Component } from '@angular/core';
import { OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-buttons.html',
  styleUrls: ['./scroll-buttons.scss'],
})
export class ScrollButtons implements OnInit, OnDestroy {

  showUp   = signal(false);
  showDown = signal(true);

  private onScroll = () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.showUp.set(scrolled > 200);
    this.showDown.set(scrolled < maxScroll - 50);
  };

  ngOnInit()    { window.addEventListener('scroll', this.onScroll); this.onScroll(); }
  ngOnDestroy() { window.removeEventListener('scroll', this.onScroll); }

  scrollUp()   { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  scrollDown() { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); }
}