import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService, GalleryItem } from '../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss'],
})
export class Gallery implements OnInit {
  galleryItems: GalleryItem[] = [];

  private readonly apiBase = 'https://api.shyamjisewasamiti.org';

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loadGalleryItems();
  }

  loadGalleryItems() {
    this.galleryService.getActive().subscribe(items => {
      this.galleryItems = items;
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/placeholder.png';
    // Agar already full URL hai toh as-is return karo
    if (imageUrl.startsWith('http')) return imageUrl;
    // Relative path hai toh API base jodo
    return `${this.apiBase}${imageUrl}`;
  }
}