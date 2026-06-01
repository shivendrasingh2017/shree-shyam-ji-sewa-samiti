import { Injectable } from '@angular/core';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const STORAGE_KEY = 'shyamji_gallery_images';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private normalizeStatus(value: any): 'active' | 'inactive' {
    return value === 'active' || value === 'inactive' ? value : 'inactive';
  }

  private readStorage(): GalleryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) as any[] : [];
      return (items || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        status: this.normalizeStatus(item.status),
        createdAt: item.createdAt
      }));
    } catch {
      return [];
    }
  }

  private writeStorage(items: GalleryItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  getAll(): GalleryItem[] {
    return this.readStorage().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getActive(): GalleryItem[] {
    return this.getAll().filter(item => item.status === 'active');
  }

  add(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
    const current = this.getAll();
    const newItem: GalleryItem = {
      ...item,
      id: `gallery_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString()
    };
    const next = [newItem, ...current];
    this.writeStorage(next);
    return newItem;
  }

  update(id: string, update: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>) {
    const current = this.getAll();
    const next: GalleryItem[] = current.map(item => item.id === id ? ({ ...item, ...update } as GalleryItem) : item);
    this.writeStorage(next);
    return next.find(item => item.id === id) as GalleryItem;
  }

  remove(id: string) {
    const next = this.getAll().filter(item => item.id !== id);
    this.writeStorage(next);
  }

  toggleStatus(id: string) {
    const current = this.getAll();
    const next: GalleryItem[] = current.map(item => item.id === id ? ({ ...item, status: item.status === 'active' ? 'inactive' : 'active' } as GalleryItem) : item);
    this.writeStorage(next);
    return next.find(item => item.id === id) as GalleryItem;
  }
}
