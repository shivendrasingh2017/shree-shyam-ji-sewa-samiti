import { Component, signal } from '@angular/core';
import { ThemeService, Festival } from '../../services/theme';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcherComponent {
  open = signal(false);
  festivals: { id: Festival; name: string; sub: string; icon: string }[] = [
    { id: 'shyam',       name: 'Shyam Bhakti', sub: 'Default theme', icon: '🙏' },
    { id: 'diwali',      name: 'Diwali',       sub: 'Lights & diyas', icon: '🪔' },
    { id: 'holi',        name: 'Holi Spirit',  sub: 'Colour bursts',  icon: '🎨' },
    { id: 'navratri',    name: 'Navratri',     sub: '9 nights',       icon: '🌙' },
    { id: 'hanuman',     name: 'Hanuman Jayanti', sub: 'Sacred red',  icon: '🔥' },
    { id: 'janmashtami', name: 'Janmashtami',  sub: 'Krishna',        icon: '🦚' },
    { id: 'ganesh',      name: 'Ganesh Chaturthi', sub: 'Bappa morya', icon: 'ॐ' },
  ];

  constructor(public theme: ThemeService) {
     // Default dark mode on
  if (!this.theme.dark()) {
    this.theme.toggleDark();
  }
  }
  toggle() { this.open.set(!this.open()); }
}
