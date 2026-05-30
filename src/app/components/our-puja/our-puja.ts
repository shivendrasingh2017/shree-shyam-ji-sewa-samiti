import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-our-puja',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './our-puja.html',
  styleUrl: './our-puja.scss',
})
export class OurPuja {
  
  tabs = ['All', 'Shyam Aarti', 'Phagun Mela', 'Ekadashi'];
  active = 'All';

  pujas = [
    { title:'Shyam Aarti',   img:'assets/puja/puja1.webp', cat:'Shyam Aarti',
      desc:'Roz subah-shaam Khatu Shyam Ji ki divya aarti me shaamil hon.' },
    { title:'Phagun Mela',   img:'assets/puja/puja2.webp', cat:'Phagun Mela',
      desc:'Khatu dhaam ka sabse bada utsav — lakhon bhakton ka sangam.' },
    { title:'Ekadashi Path', img:'assets/puja/puja3.webp', cat:'Ekadashi',
      desc:'Har Ekadashi ko Shyam Baba ke charno me path & bhajan.' },
    { title:'Nishan Yatra',  img:'assets/puja/puja4.webp', cat:'Phagun Mela',
      desc:'Reengus se Khatu tak paidal Nishan Yatra — aastha ka pratik.' },
    { title:'Chhappan Bhog', img:'assets/puja/puja5.webp', cat:'Shyam Aarti',
      desc:'Baba ko 56 prakar ke bhog ka divya samarpan.' },
    { title:'Jagran',        img:'assets/puja/puja6.webp', cat:'Ekadashi',
      desc:'Raat bhar bhajan & kirtan ke saath Shyam naam ka jaap.' },
  ];

  get filtered(){
    return this.active==='All' ? this.pujas : this.pujas.filter(p=>p.cat===this.active);
  }
}

