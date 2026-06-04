
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Abouts } from "../../components/abouts/abouts";
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
import { Donation } from "../../components/donation/donation";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, Abouts, Donation],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About  implements OnInit, AfterViewInit {

  stats = [
    {
      value: '5000+',
      title: 'Families Helped'
    },
    {
      value: '200+',
      title: 'Events Organized'
    },
    {
      value: '1000+',
      title: 'Volunteers'
    },
    {
      value: '50000+',
      title: 'Meals Distributed'
    }
  ];

  services = [
    'Religious Activities',
    'Food Distribution',
    'Education Support',
    'Medical Assistance',
    'Festival Celebrations',
    'Gau Seva'
  ];

  ngOnInit(): void {

    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });

  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      AOS.refreshHard();
    }, 300);

  }

  

}
