import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {

  // ── Banner image path ──────────────────────────
  // Size: 1920×600px
  // Path: assets/puja/ folder me rakho
  bannerImage: string = '/assets/gallery/banner_gallery1.jpg';
  // ───────────────────────────────────────────────

  activeCategory = 'All';

  categories = [
    'All',
    'Events',
    'Temple',
    'Aarti',
    'Puja',
    'Food Distribution',
    'Volunteer Activities',
    'Festivals'
  ];

  galleryImages = [
    {
      image:    'assets/gallery/gallery01.jpg',
      category: 'Events',
      title:    'Annual Event'
    },
    {
      image:    'assets/gallery/gallery02.jpg',
      category: 'Temple',
      title:    'Temple Darshan'
    },
    {
      image:    'assets/gallery/gallery03.jpg',
      category: 'Aarti',
      title:    'Morning Aarti'
    },
    {
      image:    'assets/gallery/gallery04.jpg',
      category: 'Puja',
      title:    'Special Puja'
    },
    {
      image:    'assets/gallery/gallery05.jpg',
      category: 'Festivals',
      title:    'Janmashtami'
    },
    {
      image:    'assets/gallery/food_sewa1.jpg',
      category: 'Food Distribution',
      title:    'Food Seva'
    }
  ];

  recentEvents = [
    {
      image:       'assets/gallery/event0.jpg',
      date:        '15 May 2026',
      description: 'Special Bhajan Sandhya'
    },
    {
      image:       'assets/gallery/event2.jpg',
      date:        '18 May 2026',
      description: 'Food Distribution Camp'
    },
    {
      image:       'assets/gallery/event3.jpg',
      date:        '19 May 2026',
      description: 'Shyam Baba Mahotsav'
    }
  ];

  get filteredImages() {
    if (this.activeCategory === 'All') {
      return this.galleryImages;
    }
    return this.galleryImages.filter(
      item => item.category === this.activeCategory
    );
  }

  changeCategory(category: string) {
    this.activeCategory = category;
  }

  openImage(image: string) {
    window.open(image, '_blank');
  }
}