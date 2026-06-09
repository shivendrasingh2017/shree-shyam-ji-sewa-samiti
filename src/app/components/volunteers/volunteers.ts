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
    { role: 'MUKHYA PUJARI', name: 'Mr. Gaurav Jadav', img: 'assets/volunteers/profile.jpg' },
    { role: 'SAMITI ADHYAKSH', name: 'Mr. Shivendra Singh', img: 'assets/volunteers/profile.jpg' },
    { role: 'SEVADAR', name: 'Mr. Kuldeep Singh', img: 'assets/volunteers/profile.jpg' },
    { role: 'BHAJAN GAYAK', name: 'Mr. Aviram Kumar', img: 'assets/volunteers/profile.jpg' },
  ];
}