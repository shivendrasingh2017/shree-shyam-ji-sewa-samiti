import { inject, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { OurPuja } from "../../components/our-puja/our-puja";

@Component({
  selector: 'app-puja',
  imports: [CommonModule, ReactiveFormsModule, OurPuja,RouterLink],
  templateUrl: './puja.html',
  styleUrl: './puja.scss',
})
export class Puja {
  private fb     = inject(FormBuilder);
  private http   = inject(HttpClient);
  private router = inject(Router);

  apiUrl = 'https://api.shyamjisewasamiti.org/api/';

  loading = false;

  // ── Banner image path ──────────────────────────
  // Size: 1920×500px
  // Path: assets/puja/ folder me rakho
  bannerImage: string = '/assets/puja/banner_puja3.jpg';
  // ───────────────────────────────────────────────

  pujaForm: FormGroup = this.fb.group({
    name:          ['', [Validators.required]],
    mobile:        ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email:         ['', [Validators.email]],
    panNumber:     ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    address:       ['', Validators.required],
    pujaType:      ['', Validators.required],
    preferredDate: ['', Validators.required],
    message:       ['']
  });

  pujaCategories = [
    {
      title:       'Satyanarayan Puja',
      duration:    '2 Hours',
      donation:    1100,
      description: 'For prosperity, peace and family blessings.'
    },
    {
      title:       'Rudrabhishek',
      duration:    '3 Hours',
      donation:    2100,
      description: 'Sacred worship of Lord Shiva.'
    },
    {
      title:       'Hanuman Puja',
      duration:    '1.5 Hours',
      donation:    701,
      description: 'Protection and strength.'
    },
    {
      title:       'Shyam Baba Special Puja',
      duration:    '2 Hours',
      donation:    1501,
      description: 'Special blessings of Khatu Shyam Ji.'
    },
    {
      title:       'Navgrah Puja',
      duration:    '2.5 Hours',
      donation:    2501,
      description: 'Balance planetary influences.'
    }
  ];

  upcomingPujas = [
    { date: '25 July 2026', time: '10:00 AM', location: 'Main Temple'       },
    { date: '21 August 2026', time: '11:00 AM', location: 'Shyam Darbar Hall' }
  ];

  selectPuja(name: string) {
    this.pujaForm.patchValue({ pujaType: name });
    document
      .getElementById('booking-form')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  submitBooking() {
    if (this.pujaForm.invalid) {
      this.pujaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.http
      .post(`${this.apiUrl}/puja-booking-draft`, this.pujaForm.value)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('pujaBooking', JSON.stringify(this.pujaForm.value));
          this.loading = false;
          this.router.navigate(['/donation'], {
            queryParams: {
              purpose: 'puja',
              amount:  this.getDonationAmount()
            }
          });
        },
        error: () => {
          this.loading = false;
          alert('Unable to process request');
        }
      });
  }

  getDonationAmount(): number {
    const selected = this.pujaCategories.find(
      x => x.title === this.pujaForm.value.pujaType
    );
    return selected?.donation || 501;
  }
}