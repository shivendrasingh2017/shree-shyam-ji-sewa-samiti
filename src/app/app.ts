import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ThemeSwitcherComponent } from "./components/theme-switcher/theme-switcher";
import { ScrollButtons } from "./components/scroll-buttons/scroll-buttons";
import { SiteBanner } from './banner/site-banner';
import { SocialShare } from "./shared/social-share/social-share";
import { CookieConsent } from "./components/cookie-consent/cookie-consent";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ThemeSwitcherComponent, ScrollButtons, SiteBanner, SocialShare, CookieConsent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shyamjisewasamiti');
}


