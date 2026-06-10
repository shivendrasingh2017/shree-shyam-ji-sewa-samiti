import { Routes } from '@angular/router';

export const routes: Routes = [

	{ path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
	{ path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
	{ path: 'live-broadcast', loadComponent: () => import('./components/live-broadcast/live-broadcast').then(m => m.LiveBroadcast) },
	{path: 'aarti', loadComponent: ()=> import('./pages/aarti/aarti').then(m => m.Aarti)},
	{path: 'puja', loadComponent: ()=> import('./pages/puja/puja').then(m => m.Puja)},
	{ path: 'our-puja', loadComponent: () => import('./components/our-puja/our-puja').then(m => m.OurPuja) },
	{ path: 'gallery', loadComponent: () => import('./components/gallery/gallery').then(m => m.Gallery) },
	{ path: 'donation', loadComponent: () => import('./components/donation/donation').then(m => m.Donation) },
	{ path: 'donation-page', loadComponent: () => import('./pages/donation-page/donation-page').then(m => m.DonationPage) },
	{ path: 'admin', loadComponent: () => import('./components/admin/admin').then(m => m.Admin) },
	{ path: 'contact', loadComponent: () => import('./pages/contact-bar/contact-bar').then(m => m.ContactBar) },
	{path: 'our-gallery', loadComponent: ()=> import('./pages/gallery/gallery').then(m => m.Gallery)},
	{path: 'privacy-policy', loadComponent: ()=> import('./components/privacy-policy/privacy-policy').then(m=>m.PrivacyPolicy)},
	{ path: 'terms-and-conditions', loadComponent: () => import('./components/terms-conditions/terms-conditions').then(m => m.TermsConditions) },
	{ path: '**', redirectTo: '' }
];


