
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Abouts } from "../../components/abouts/abouts";
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, Abouts],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About  implements OnInit, AfterViewInit {

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