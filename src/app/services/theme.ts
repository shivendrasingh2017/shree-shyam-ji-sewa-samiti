import { Injectable, signal, effect } from '@angular/core';

export type Festival = 'diwali' | 'holi' | 'navratri' | 'hanuman' | 'janmashtami' | 'ganesh' | 'shyam';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  festival = signal<Festival>((localStorage.getItem('festival') as Festival) || 'shyam');
  dark = signal<boolean>(localStorage.getItem('dark') !== 'false');

  constructor() {
    effect(() => {
      const f = this.festival();
      document.documentElement.setAttribute('data-festival', f);
      localStorage.setItem('festival', f);
    });
    effect(() => {
      document.documentElement.classList.toggle('dark', this.dark());
      localStorage.setItem('dark', String(this.dark()));
    });
  }

  setFestival(f: Festival) { this.festival.set(f); }
  toggleDark() { this.dark.set(!this.dark()); }
}
