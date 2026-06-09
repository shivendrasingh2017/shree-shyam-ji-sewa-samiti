import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-abouts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './abouts.html',
  styleUrl: './abouts.scss',
})
export class Abouts implements OnInit {
  isLoading = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }
}