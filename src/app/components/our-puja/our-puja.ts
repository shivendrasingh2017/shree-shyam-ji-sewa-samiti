import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-our-puja',
   standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './our-puja.html',
  styleUrl: './our-puja.scss',
})
export class OurPuja {
  
  tabs = ['All', 'Shyam Aarti', 'Phagun Mela', 'Ekadashi'];
  active = 'All';

  pujas = [
    { title:'Shyam Aarti',   img:'assets/puja/our-puja1.jpg', cat:'Shyam Aarti',
      desc:'Roz subah-shaam Khatu Shyam Ji ki divya aarti me shaamil hon.' },
    { title:'Phagun Mela',   img:'assets/puja/our-puja2.jpg', cat:'Phagun Mela',
      desc:'Khatu dhaam ka sabse bada utsav — lakhon bhakton ka sangam.' },
    { title:'Ekadashi Path', img:'assets/puja/our-puja3.jpg', cat:'Ekadashi',
      desc:'Har Ekadashi ko Shyam Baba ke charno me path & bhajan.' },
    { title:'Nishan Yatra',  img:'assets/puja/our-puja4.jpg', cat:'Phagun Mela',
      desc:'Reengus se Khatu tak paidal Nishan Yatra — aastha ka pratik.' },
    { title:'Chhappan Bhog', img:'assets/puja/our-puja5.jpg', cat:'Shyam Aarti',
      desc:'Baba ko 56 prakar ke bhog ka divya samarpan.' },
    { title:'Jagran',        img:'assets/puja/our-puja6.jpg', cat:'Ekadashi',
      desc:'Raat bhar bhajan & kirtan ke saath Shyam naam ka jaap.' },
  ];

  get filtered(){
    return this.active==='All' ? this.pujas : this.pujas.filter(p=>p.cat===this.active);
  }
}

