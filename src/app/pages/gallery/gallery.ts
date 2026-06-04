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
      image: 'assets/gallery/event1.jpg',
      category: 'Events',
      title: 'Annual Event'
    },
    {
      image: 'assets/gallery/temple1.jpg',
      category: 'Temple',
      title: 'Temple Darshan'
    },
    {
      image: 'assets/gallery/aarti1.jpg',
      category: 'Aarti',
      title: 'Morning Aarti'
    },
    {
      image: 'assets/gallery/puja1.jpg',
      category: 'Puja',
      title: 'Special Puja'
    },
    {
      image: 'assets/gallery/festival1.jpg',
      category: 'Festivals',
      title: 'Janmashtami'
    },
    {
      image: 'assets/gallery/food1.jpg',
      category: 'Food Distribution',
      title: 'Food Seva'
    }
  ];

  recentEvents = [
    {
      image: 'assets/events/event1.jpg',
      date: '15 Aug 2026',
      description: 'Special Bhajan Sandhya'
    },
    {
      image: 'assets/events/event2.jpg',
      date: '20 Aug 2026',
      description: 'Food Distribution Camp'
    },
    {
      image: 'assets/events/event3.jpg',
      date: '25 Aug 2026',
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
