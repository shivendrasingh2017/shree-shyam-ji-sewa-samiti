import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-broadcast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-broadcast.html',
  styleUrl: './live-broadcast.scss',
})
export class LiveBroadcast {
  isPlaying = signal(false);

  playVideo() {
    this.isPlaying.set(true);
  }

  stopVideo() {
    this.isPlaying.set(false);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.stopVideo();
  }
}
