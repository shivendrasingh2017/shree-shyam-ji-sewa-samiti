import { Component } from '@angular/core';
import { Contact } from "../../components/contact/contact";

@Component({
  selector: 'app-contact-bar',
  imports: [Contact],
  templateUrl: './contact-bar.html',
  styleUrl: './contact-bar.scss',
})
export class ContactBar {}
