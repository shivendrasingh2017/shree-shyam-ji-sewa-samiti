import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiveBroadcast } from '../../components/live-broadcast/live-broadcast';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {  HostListener } from '@angular/core';

type AartiItem = {
  title: string;
  lyrics: string;
};

@Component({
  selector: 'app-aarti',
  imports: [CommonModule, LiveBroadcast, RouterModule],
  templateUrl: './aarti.html',
  styleUrls: ['./aarti.scss'],
})
export class Aarti {
  isLive = true;
  heroImage = 'assets/home/banner_temple1.webp';

  selectedAarti: AartiItem | null = null;
  lyricsModalOpen = false;
  pdfLoading = false;

  aartiTimings = [
    { name: 'Mangla Aarti', time: '5:00 AM' },
    { name: 'Shringar Aarti', time: '8:00 AM' },
    { name: 'Rajbhog Aarti', time: '12:00 PM' },
    { name: 'Sandhya Aarti', time: '7:00 PM' },
    { name: 'Shayan Aarti', time: '9:00 PM' },
  ];

  aartis: AartiItem[] = [
    {
      title: 'Khatu Shyam Ji Aarti',
      lyrics: `ॐ जय श्री श्याम हरे,
      बाबा जय श्री श्याम हरे । खाटू धाम विराजत,
      अनुपम रूप धरे । ॐ जय श्री श्याम हरे…
      रतन जड़ित सिंहासन, सिर पर चंवर ढुरे ।
      तन केसरिया बागो, कुण्डल श्रवण पड़े ।
      ॐ जय श्री श्याम हरे…

गल पुष्पों की माला, सिर पार मुकुट धरे ।
खेवत धूप अग्नि पर,दीपक ज्योति जले ।
ॐ जय श्री श्याम हरे…

मोदक, खीर, चूरमा, सुवरण थाल भरे ।
सेवक भोग लगावत, सेवा नित्य करे ।
ॐ जय श्री श्याम हरे…

झांझ, कटोरा और घडियावल, शंख मृदंग घुरे ।
भक्त आरती गावे, जय जयकार करे ।
ॐ जय श्री श्याम हरे…

जो ध्यावे फल पावे, सब दुःख से उबरे ।
सेवक जन निज मुख से, श्री श्याम – श्याम उचरे ।
ॐ जय श्री श्याम हरे…

श्री श्याम बिहारी जी की आरती, जो कोई नर गावे ।
कहत भक्त जन, मनवांछित फल पावे ।
ॐ जय श्री श्याम हरे…

जय श्री श्याम हरे, बाबा जय श्री श्याम हरे ।
निज भक्तों के तुमने, पूरण काज करे ।
ॐ जय श्री श्याम हरे…

ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे ।
खाटू धाम विराजत, अनुपम रूप धरे ।
ॐ जय श्री श्याम हरे…`,
    },
    {
      title: 'Om Jai Jagdish Hare',
      lyrics: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।
       भक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥ ॥
       ॐ जय जगदीश हरे..॥
       जो ध्यावे फल पावे, दुःख बिनसे मन का, स्वामी दुःख बिनसे मन का ।
       सुख सम्पति घर आवे, सुख सम्पति घर आवे, कष्ट मिटे तन का ॥ ॥ 
       ॐ जय जगदीश हरे..॥ 
       मात पिता तुम मेरे, शरण गहूं किसकी, स्वामी शरण गहूं मैं किसकी । 
       तुम बिन और न दूजा, तुम बिन और न दूजा, आस करूं मैं जिसकी ॥ ॥
       ॐ जय जगदीश हरे..॥
       तुम पूरण परमात्मा, तुम अन्तर्यामी, स्वामी तुम अन्तर्यामी ।
       पारब्रह्म परमेश्वर, पारब्रह्म परमेश्वर, तुम सब के स्वामी ॥ ॥
       ॐ जय जगदीश हरे..॥
       तुम करुणा के सागर, तुम पालनकर्ता, स्वामी तुम पालनकर्ता ।
       मैं मूरख फलकामी, मैं सेवक तुम स्वामी, कृपा करो भर्ता॥ ॥
       ॐ जय जगदीश हरे..॥
       तुम हो एक अगोचर, सबके प्राणपति, स्वामी सबके प्राणपति ।
       किस विधि मिलूं दयामय, किस विधि मिलूं दयामय, तुमको मैं कुमति ॥ ॥
       ॐ जय जगदीश हरे..॥
       दीन-बन्धु दुःख-हर्ता, ठाकुर तुम मेरे, स्वामी रक्षक तुम मेरे ।
       अपने हाथ उठाओ, अपने शरण लगाओ, द्वार पड़ा तेरे ॥ ॥ 
       ॐ जय जगदीश हरे..॥
       विषय-विकार मिटाओ, पाप हरो देवा, स्वमी पाप(कष्ट) हरो देवा ।
       श्रद्धा भक्ति बढ़ाओ, श्रद्धा भक्ति बढ़ाओ, सन्तन की सेवा ॥
       ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।
       भक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥`,
    },
    {
      title: 'Hanuman Ji Aarti',
      lyrics: ` ॥ श्री हनुमंत स्तुति ॥ 
      मनोजवं मारुत तुल्यवेगं, जितेन्द्रियं, बुद्धिमतां वरिष्ठम् ॥
      वातात्मजं वानरयुथ मुख्यं, श्रीरामदुतं शरणम प्रपद्धे ॥ 
                  ॥ आरती ॥ 
      आरती कीजै हनुमान लला की । दुष्ट दलन रघुनाथ कला की ॥ 
      जाके बल से गिरवर काँपे । रोग-दोष जाके निकट न झाँके ॥ 
      अंजनि पुत्र महा बलदाई । संतन के प्रभु सदा सहाई ॥ 
      आरती कीजै हनुमान लला की ॥ 
      दे वीरा रघुनाथ पठाए । लंका जारि सिया सुधि लाये ॥ 
      लंका सो कोट समुद्र सी खाई । जात पवनसुत बार न लाई ॥ 
      आरती कीजै हनुमान लला की ॥ 
      लंका जारि असुर संहारे । सियाराम जी के काज सँवारे ॥ 
      लक्ष्मण मुर्छित पड़े सकारे । लाये संजिवन प्राण उबारे ॥ 
      आरती कीजै हनुमान लला की ॥ 
      पैठि पताल तोरि जमकारे । अहिरावण की भुजा उखारे ॥ 
      बाईं भुजा असुर दल मारे । दाहिने भुजा संतजन तारे ॥ 
      आरती कीजै हनुमान लला की ॥ 
      सुर-नर-मुनि जन आरती उतरें । जय जय जय हनुमान उचारें ॥ 
      कंचन थार कपूर लौ छाई । आरती करत अंजना माई ॥ 
      आरती कीजै हनुमान लला की ॥ 
      जो हनुमानजी की आरती गावे । बसहिं बैकुंठ परम पद पावे ॥ 
      लंक विध्वंस किये रघुराई । तुलसीदास स्वामी कीर्ति गाई ॥ 
      आरती कीजै हनुमान लला की । दुष्ट दलन रघुनाथ कला की ॥ 
                    ॥ इति संपूर्णंम् ॥`,
    },
    {
      title: 'Ganesh Ji Ki Aarti',
      lyrics: `जय गणेश, जय गणेश, जय गणेश देवा। माता जाकी पार्वती, पिता महादेवा।। 
      एकदंत, दयावन्त, चार भुजाधारी, माथे सिन्दूर सोहे, मूस की सवारी। 
      पान चढ़े, फूल चढ़े और चढ़े मेवा, लड्डुअन का भोग लगे, सन्त करें सेवा।। .. 
      जय गणेश, जय गणेश, जय गणेश, देवा। माता जाकी पार्वती, पिता महादेवा।। 
      अंधन को आंख देत, कोढ़िन को काया, बांझन को पुत्र देत, निर्धन को माया। 
      'सूर' श्याम शरण आए, सफल कीजे सेवा।। 
      जय गणेश जय गणेश जय गणेश देवा .. माता जाकी पार्वती, पिता महादेवा।`,
    },
    {
      title: 'Laxmi Ji Ki Aarti',
      lyrics: `ओम जय लक्ष्मी माता, मैया जय लक्ष्मी माता। 
      तुमको निशिदिन सेवत, हरि विष्णु विधाता॥ 
      ओम जय लक्ष्मी माता॥ 
      उमा, रमा, ब्रह्माणी, तुम ही जग-माता। मैया तुम ही जग-माता।। 
      सूर्य-चंद्रमा ध्यावत, नारद ऋषि गाता॥ 
      ओम जय लक्ष्मी माता॥ 
      दुर्गा रुप निरंजनी, सुख सम्पत्ति दाता। मैया सुख सम्पत्ति दाता॥ 
      जो कोई तुमको ध्याता, ऋद्धि-सिद्धि धन पाता॥ 
      ओम जय लक्ष्मी माता॥ 
      तुम पाताल-निवासिनि, तुम ही शुभदाता। मैया तुम ही शुभदाता॥ 
      कर्म-प्रभाव-प्रकाशिनी, भवनिधि की त्राता॥ 
      ओम जय लक्ष्मी माता॥ 
      जिस घर में तुम रहतीं, सब सद्गुण आता। मैया सब सद्गुण आता॥ 
      सब सम्भव हो जाता, मन नहीं घबराता॥ 
      ओम जय लक्ष्मी माता॥ 
      तुम बिन यज्ञ न होते, वस्त्र न कोई पाता। मैया वस्त्र न कोई पाता॥ 
      खान-पान का वैभव, सब तुमसे आता॥ 
      ओम जय लक्ष्मी माता॥ 
      शुभ-गुण मंदिर सुंदर, क्षीरोदधि-जाता। मैया क्षीरोदधि-जाता॥ 
      रत्न चतुर्दश तुम बिन, कोई नहीं पाता॥ 
      ओम जय लक्ष्मी माता॥ 
      महालक्ष्मीजी की आरती, जो कोई जन गाता। मैया जो कोई जन गाता॥ 
      उर आनन्द समाता, पाप उतर जाता॥ 
      ओम जय लक्ष्मी माता॥ 
      ऊं जय लक्ष्मी माता, मैया जय लक्ष्मी माता। तुमको निशदिन सेवत, हरि विष्णु विधाता। 
      ऊं जय लक्ष्मी माता।।`,
    },
    {
      title: 'Shiv Ji Ki Aarti',
      lyrics: `ॐ जय शिव ओंकारा, 
      स्वामी जय शिव ओंकारा।  ब्रह्मा, विष्णु, सदाशिव, अर्द्धांगी धारा॥ 
      ओम जय शिव ओंकारा॥ 
      एकानन चतुरानन पञ्चानन राजे। हंसासन गरूड़ासन वृषवाहन साजे॥ 
      ओम जय शिव ओंकारा॥ 
      दो भुज चार चतुर्भुज दसभुज अति सोहे। त्रिगुण रूप निरखत त्रिभुवन जन मोहे॥ 
      ओम जय शिव ओंकारा॥ 
      अक्षमाला वनमाला मुण्डमालाधारी। त्रिपुरारी कंसारी कर माला धारी॥ 
      ओम जय शिव ओंकारा॥ 
      श्वेताम्बर पीताम्बर बाघंबर अंगे। सनकादिक गरुड़ादिक भूतादिक संगे॥ 
      ओम जय शिव ओंकारा॥ 
      कर के मध्य कमण्डल चक्र त्रिशूलधारी। जगकर्ता जगभर्ता जगसंहारकर्ता॥ 
      ओम जय शिव ओंकारा॥ 
      ब्रह्मा विष्णु सदाशिव जानत अविवेका। प्रणवाक्षर के मध्ये ये तीनों एका॥ 
      ओम जय शिव ओंकारा॥ 
      पर्वत सोहैं पार्वती, शंकर कैलासा। भांग धतूरे का भोजन, भस्मी में वासा॥ 
      ओम जय शिव ओंकारा॥ 
      जटा में गंग बहत है, गल मुण्डन माला। शेष नाग लिपटावत, ओढ़त मृगछाला॥ 
      ओम जय शिव ओंकारा॥ 
      काशी में विराजे विश्वनाथ, नन्दी ब्रह्मचारी। नित उठ दर्शन पावत, महिमा अति भारी॥ 
      ओम जय शिव ओंकारा॥ 
      त्रिगुणस्वामी जी की आरति जो कोइ नर गावे। कहत शिवानन्द स्वामी, मनवान्छित फल पावे॥ 
      ओम जय शिव ओंकारा॥ 
      स्वामी ओम जय शिव ओंकारा॥`,
    },
    {
      title: 'Shree Rama Ji Ki Aarti',
      lyrics: `श्री रामचंद्र कृपालु भजु मन हरण भवभय दारुणम् |
नव कंज लोचन कंजमुख कर-कंज पद कन्जारुणम् ||
कंदर्प अगणित अमित छवि नवनीलनीरद सुंदरम् |
पट्पीत मानहु तड़ित रूचि शुचि नौमीजनक सुतावरम् ||
भजु दीनबंधु दिनेश दानव-दैत्यवंश-निकंदनम् |
रघुनंद आनंदकंद कौशलचंद दशरथ-नन्दनम् ||
सर मुकुट कुण्डल तिलक चारु उदारु अङ्ग विभुषणं |
आजानुभुज शर-चाप-धर, संग्राम-जित-खरदूषणं ||
इति वदति तुलसीदास शंकर-शेष मुनि-मन-रंजनम् |
मम हृदयकंज, निवास कुरु, कामादि खल-दल गंजनम् ||
मनु जाहीं राँचेउ मिलिह सो बरु सहज सुन्दर सांवरो |
करुना निधान सुजान शीलू सनेह जानत सांवरो ||
एहि भांति गौरी असीस सुनी, सिय सहित हिय हरषी अली |
तुलसी भवानिहि पूजि पुनि मुदित मन मंदिर चली ||`,
    },
  ];

  benefits = [
    {
      icon: 'fa-solid fa-om',
      title: 'Spiritual Peace',
      description: 'Experience inner peace and devotion through daily Aarti.',
    },
    {
      icon: 'fa-solid fa-sun',
      title: 'Positive Energy',
      description: 'Fill your life with positivity and divine vibrations.',
    },
    {
      icon: 'fa-solid fa-hands-praying',
      title: 'Divine Blessings',
      description: 'Seek blessings of Khatu Shyam Ji and prosperity.',
    },
    {
      icon: 'fa-solid fa-people-group',
      title: 'Community Participation',
      description: 'Join devotees and celebrate together in devotion.',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}
  getEmbedUrl(videoId: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  );
}

  readLyrics(aarti: AartiItem): void {
    this.selectedAarti = aarti;
    this.lyricsModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLyricsModal(event?: MouseEvent | null): void {
    if (event && event.target !== event.currentTarget) return;

    this.lyricsModalOpen = false;
    this.selectedAarti = null;
    document.body.style.overflow = '';
  }

  async downloadLyricsPdf(aarti: AartiItem): Promise<void> {
    if (this.pdfLoading) return;
    this.pdfLoading = true;

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = '-10000px';
      element.style.top = '0';
      element.style.width = '794px';
      element.style.height = '1123px';
      element.style.background = '#ffffff';
      element.innerHTML = this.buildPrintHtml(aarti);

      document.body.appendChild(element);
      await this.waitForImages(element);

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794,
        windowHeight: 1123,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

      const fileName = aarti.title.replace(/\s+/g, '-').toLowerCase();
      pdf.save(`${fileName}.pdf`);

      document.body.removeChild(element);
    } catch (error) {
      console.error(error);
      alert('PDF download nahi ho paya. Please try again.');
    } finally {
      this.pdfLoading = false;
    }
  }

  printAarti(aarti: AartiItem): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      alert('Popup blocked hai. Please browser me popup allow karein.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${this.escapeHtml(aarti.title)}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }

          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${this.buildPrintHtml(aarti)}
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
              window.close();
            }, 500);
          };
        <\/script>
      </body>
    </html>
  `);
    printWindow.document.close();
  }

  private buildPrintHtml(aarti: AartiItem): string {
    return `
    <div style="
      width:794px;
      height:1123px;
      box-sizing:border-box;
      background:#fff;
      font-family:Arial, sans-serif;
      color:#222;
      position:relative;
      overflow:hidden;
      padding:18px 34px 30px 34px;
    ">

      <img src="assets/logo/LOGO.png" style="
        position:absolute;
        top:52%;
        left:50%;
        transform:translate(-50%, -50%);
        width:470px;
        height:470px;
        object-fit:contain;
        opacity:0.055;
        z-index:0;
      ">

      <div style="
        position:relative;
        z-index:1;
        height:100%;
        display:flex;
        flex-direction:column;
      ">

        <!-- Compact Header -->
        <div style="
          border-bottom:2px solid #d4af37;
          padding-bottom:8px;
          margin-bottom:10px;
          flex-shrink:0;
        ">

          <div style="
            position:relative;
            height:90px;
          ">

            <!-- Left Logo -->
            <img src="assets/logo/LOGO.png" style="
              position:absolute;
              left:0;
              top:50%;
              transform:translateY(-50%);
              width:220px;
              height:90px;
              object-fit:contain;
            ">

            <!-- Center Heading -->
            <div style="
              position:absolute;
              left:50%;
              top:50%;
              transform:translate(-50%, -50%);
              text-align:center;
              width:100%;
            ">
              <h1 style="
                margin:0;
                font-size:30px;
                color:#8b3f17;
                font-weight:800;
                line-height:1;
              ">
                श्री श्याम जी सेवा समिति
              </h1>

              <div style="
                font-size:14px;
                color:#555;
                margin-top:5px;
                font-style:italic;
              ">
                Shree Shyam Ji Sewa Samiti
              </div>
            </div>

          </div>

          <!-- Aarti Title -->
          <h2 style="
            text-align:center;
            margin:12px 0 0;
            font-size:22px;
            color:#b8860b;
            font-weight:800;
            line-height:1.1;
          ">
            ${this.escapeHtml(aarti.title)}
          </h2>

        </div>

        <!-- Lyrics -->
        <div style="
          flex:1;
          overflow:hidden;
          white-space:pre-line;
          font-size:${this.getLyricsFontSize(aarti.lyrics)}px;
          line-height:${this.getLyricsLineHeight(aarti.lyrics)};
          text-align:center;
          padding:0 6px;
        ">${this.escapeHtml(aarti.lyrics)}</div>

        <!-- Compact Footer -->
        <div style="
          flex-shrink:0;
          text-align:center;
          font-size:9px;
          color:#777;
          border-top:1px dashed #d0d0d0;
          padding-top:5px;
          margin-top:6px;
          background:#fff;
        ">
          This is a system generated Aarti lyrics page.
        </div>

      </div>
    </div>
  `;
  }

  private getLyricsFontSize(lyrics: string): number {
    const lines = lyrics.split('\n').filter(line => line.trim()).length;
    const chars = lyrics.length;

    if (lines <= 35 && chars <= 900) return 21;
    if (lines <= 45 && chars <= 1300) return 18;
    if (lines <= 55 && chars <= 1700) return 15.5;
    if (lines <= 70 && chars <= 2300) return 13;

    return 10.8;
  }

  private getLyricsLineHeight(lyrics: string): number {
    const lines = lyrics.split('\n').filter(line => line.trim()).length;
    const chars = lyrics.length;

    if (lines <= 35 && chars <= 900) return 1.55;
    if (lines <= 45 && chars <= 1300) return 1.38;
    if (lines <= 55 && chars <= 1700) return 1.22;
    if (lines <= 70 && chars <= 2300) return 1.08;

    return 1.0;
  }

  private waitForImages(element: HTMLElement): Promise<void> {
    const images = Array.from(element.querySelectorAll('img'));

    return Promise.all(
      images.map((img: HTMLImageElement) => {
        if (img.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    ).then(() => undefined);
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
 videos = [
  {
    title: 'Shiv Ji Aarti',
    videoId: 'bZ7l8YMppl4',
    playing: false,
  },
  {
    title: 'Laxmi Ji Ki Aarti',
    videoId: 'FkvEu98iL5I',
    playing: false,
  },
  {
    title: 'Bhasm Aarti',
    videoId: 'RyP0k7Fmu6E',
    playing: false,
  },
];



getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

onThumbError(event: Event, videoId: string): void {
  const img = event.target as HTMLImageElement;
  img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

playVideo(video: any): void {
  this.videos.forEach(v => v.playing = false);
  video.playing = true;
}

stopAllVideos(): void {
  this.videos.forEach(v => v.playing = false);
}

@HostListener('window:scroll')
onWindowScroll(): void {
  this.stopAllVideos();
}

}