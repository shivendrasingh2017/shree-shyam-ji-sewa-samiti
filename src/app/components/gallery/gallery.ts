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

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loadGalleryItems();
  }

  loadGalleryItems() {
    this.galleryItems = this.galleryService.getActive();
  }
}
