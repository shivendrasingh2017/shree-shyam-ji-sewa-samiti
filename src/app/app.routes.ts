import { Routes } from '@angular/router';

export const routes: Routes = [

	{ path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
	{ path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
	{ path: 'aarti', loadComponent: () => import('./components/live-broadcast/live-broadcast').then(m => m.LiveBroadcast) },
	{ path: 'puja', loadComponent: () => import('./components/our-puja/our-puja').then(m => m.OurPuja) },
	{ path: 'gallery', loadComponent: () => import('./components/gallery/gallery').then(m => m.Gallery) },
	{ path: 'donation', loadComponent: () => import('./components/donation/donation').then(m => m.Donation) },
	{ path: 'admin', loadComponent: () => import('./components/admin/admin').then(m => m.Admin) },
	{ path: 'contact', loadComponent: () => import('./pages/contact-bar/contact-bar').then(m => m.ContactBar) },
	{ path: '**', redirectTo: '' }
];


