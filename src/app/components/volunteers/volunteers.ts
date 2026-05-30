import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volunteers',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './volunteers.html',
  styleUrl: './volunteers.scss',
})
export class Volunteers {
  members = [
    { role: 'MUKHYA PUJARI', name: 'Mr. Gaurav Jadav', img: 'assets/images/v1.jpg' },
    { role: 'SAMITI ADHYAKSH', name: 'Shri Shivendra Singh', img: 'assets/images/v2.jpg' },
    { role: 'SEVADAR', name: 'Kuldeep Singh', img: 'assets/images/v3.jpg' },
    { role: 'BHAJAN GAYAK', name: 'Riya Sharma', img: 'assets/images/v4.jpg' },
  ];
}

