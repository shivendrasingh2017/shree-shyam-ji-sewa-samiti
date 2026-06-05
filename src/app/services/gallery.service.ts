import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_BASE = 'https://api.shyamjisewasamiti.org';

export interface GalleryItem {
  id: string;
  _id?: string;       // ← ADD: MongoDB field bhi rakhlo
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ── Helper: _id → id map karo ──────────────────────────────
function mapItem(item: any): GalleryItem {
  return { ...item, id: item._id || item.id };
}

@Injectable({ providedIn: 'root' })
export class GalleryService {

  private readonly base = `${API_BASE}/api/gallery`;

  constructor(private http: HttpClient) {}

  // ── Auth header (PUT/DELETE ke liye) ─────────────────────
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<GalleryItem[]> {
    return this.http
      .get<ApiResponse<GalleryItem[]>>(this.base)
      .pipe(map(res => (res.data ?? []).map(mapItem)));
  }

  getActive(): Observable<GalleryItem[]> {
    return this.http
      .get<ApiResponse<GalleryItem[]>>(`${this.base}?status=active`)
      .pipe(map(res => (res.data ?? []).map(mapItem)));
  }

  getById(id: string): Observable<GalleryItem> {
    return this.http
      .get<ApiResponse<GalleryItem>>(`${this.base}/${id}`)
      .pipe(map(res => mapItem(res.data)));
  }

  // ── CREATE — NO auth header (backend mein auth remove kiya) ──
  create(payload: {
    title: string;
    description: string;
    status: 'active' | 'inactive';
    image: File;
  }): Observable<GalleryItem> {
    const form = new FormData();
    form.append('title',       payload.title);
    form.append('description', payload.description);
    form.append('status',      payload.status);
    form.append('image',       payload.image);

    // ⚠️ Content-Type mat set karo — browser khud boundary set karta hai FormData ke liye
    return this.http
      .post<ApiResponse<GalleryItem>>(this.base, form)
      .pipe(map(res => mapItem(res.data)));
  }

  // ── UPDATE — auth header chahiye ─────────────────────────
  update(id: string, payload: {
    title?: string;
    description?: string;
    status?: 'active' | 'inactive';
    image?: File;
  }): Observable<GalleryItem> {
    const form = new FormData();
    if (payload.title)       form.append('title',       payload.title);
    if (payload.description) form.append('description', payload.description);
    if (payload.status)      form.append('status',      payload.status);
    if (payload.image)       form.append('image',       payload.image);

    return this.http
      .put<ApiResponse<GalleryItem>>(`${this.base}/${id}`, form, {
        headers: this.authHeaders()
      })
      .pipe(map(res => mapItem(res.data)));
  }

  // ── DELETE — auth header chahiye ─────────────────────────
  remove(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.base}/${id}`, {
        headers: this.authHeaders()
      })
      .pipe(map(() => void 0));
  }

  // ── PATCH toggle status — auth header chahiye ─────────────
  toggleStatus(id: string, newStatus: 'active' | 'inactive'): Observable<GalleryItem> {
    const form = new FormData();
    form.append('status', newStatus);

    return this.http
      .put<ApiResponse<GalleryItem>>(`${this.base}/${id}`, form, {
        headers: this.authHeaders()
      })
      .pipe(map(res => mapItem(res.data)));
  }
}