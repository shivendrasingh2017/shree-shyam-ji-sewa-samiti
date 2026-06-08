import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InvoicePdf {
  async downloadPdf(receipt: any): Promise<void> {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    const element = document.createElement('div');
    element.style.position = 'fixed';
    element.style.left = '-10000px';
    element.style.top = '0';
    element.style.width = '794px';
    element.style.background = '#ffffff';
    element.innerHTML = this.buildHtml(receipt);

    document.body.appendChild(element);

    try {
      await this.waitForImages(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794,
        windowHeight: 1123,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

      pdf.save(`${receipt.invoiceNumber || 'donation-receipt'}.pdf`);
    } finally {
      document.body.removeChild(element);
    }
  }

  private buildHtml(r: any): string {
    const logo = 'assets/logo/LOGO.png';
    const campaign = r.campaignId || r.campaign || {};
    const createdAt = r.createdAt ? new Date(r.createdAt) : new Date();

    const date = createdAt.toLocaleDateString('en-IN');
    const time = createdAt.toLocaleTimeString('en-IN');

    const amount = Number(r.amount || 0);
    const amountText = `₹${amount.toFixed(2)}`;
    const amountWords = `${this.numberToWordsIndian(amount)} Only`;

    return `
      <div style="
        width:794px;
        height:1123px;
        background:#fff;
        padding:34px 42px;
        box-sizing:border-box;
        font-family:Arial, Helvetica, sans-serif;
        color:#111;
        position:relative;
        overflow:hidden;
      ">

        <img src="${logo}" style="
          position:absolute;
          width:390px;
          height:390px;
          object-fit:contain;
          left:202px;
          top:360px;
          opacity:0.055;
          z-index:0;
        " />

        <div style="position:relative;z-index:1;height:100%;display:flex;flex-direction:column;">

          <!-- HEADER -->
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:14px;">
              <img src="${logo}" style="width:112px;height:82px;object-fit:contain;" />
              <div>
                <div style="font-size:27px;font-weight:800;color:#8b3f17;line-height:1.05;">
                  श्री श्याम जी सेवा समिति
                </div>
                <div style="font-size:14px;color:#555;font-style:italic;margin-top:8px;">
                  Shree Shyam Ji Sewa Samiti
                </div>
              </div>
            </div>

            <div style="text-align:right;">
              <div style="font-size:14px;font-weight:800;color:#b8860b;line-height:1.15;">
                DONATION RECEIPT
              </div>
              <div style="font-size:12px;margin-top:12px;">
                Receipt No: ${this.safe(r.invoiceNumber || r._id || '—')}
              </div>
              <div style="font-size:12px;margin-top:8px;">
                Date: ${date}
              </div>
            </div>
          </div>

          <div style="text-align:center;margin-top:18px;font-size:13px;line-height:1.55;">
            <div>Noida Sector 63, Uttar Pradesh, India</div>
            <div>Unique Registration Number :  '<strong>AAEBS4366FE20261</strong>'</div>
            <div>E-Mail : shyamjisewasamiti@gmail.com</div>
          </div>

          <div style="height:2px;background:#b8860b;margin:20px 0 30px;"></div>

          <!-- DETAILS -->
          <div style="display:flex;gap:38px;">

            <div style="width:50%;">
              ${this.sectionTitle('', 'DONOR INFORMATION')}
              ${this.infoRow('Name', r.donorFullName || 'Anonymous')}
              ${this.infoRow('Email', r.donorEmail || '—')}
              ${this.infoRow('Contact', `${r.donorCountryCode || '+91'} ${r.donorMobile || '—'}`)}
              ${this.infoRow('Address', r.donorAddress || '—')}
              ${this.infoRow('Nationality', r.donorNationality || 'India')}
              ${this.infoRow('PAN', r.donorPAN || '—')}
              ${this.infoRow('Whatsapp No.', r.donorMobile || '—')}
            </div>

            <div style="width:50%;">
              ${this.sectionTitle('', 'DONATION FOR')}
              ${this.infoRow('Campaign', campaign.title || 'General Donation')}
              ${this.infoRow('Description', campaign.description || 'Religious & Social Service')}
              ${this.infoRow('Payment ID', r.razorpay_payment_id || '—')}
              ${this.infoRow('Order ID', r.razorpay_order_id || '—')}
              ${this.infoRow('Currency', r.currency || 'INR')}
              ${this.infoRow('The sum of Rs.', amountText)}
              ${this.infoRow('In Words', amountWords)}
            </div>

          </div>

          <!-- AMOUNT BOX -->
          <div style="
            margin-top:28px;
            background:#f7f7f7;
            border-left:5px solid #d4af37;
            padding:20px 26px;
          ">
            <div style="display:flex;justify-content:space-between;font-size:14px;">
              <div>Total Donation Amount</div>
              <div>${amountText}</div>
            </div>

            <div style="height:1px;background:#b8860b;margin:16px 0;"></div>

            <div style="display:flex;justify-content:space-between;align-items:center;font-size:23px;font-weight:800;">
              <div style="color:#7b3517;">Total Amount</div>
              <div style="color:#0b8f3a;">${amountText}</div>
            </div>
          </div>

          <!-- TAX INFO -->
          <div style="margin-top:22px;font-size:13px;">
            ${this.fullRow('Eligible for deduction Section', 'Section 35(1)(ii)')}
            ${this.fullRow('Our Income Tax Unique Registeration No', 'AAEBS4366FE20261')}
          </div>

          <div style="height:1px;background:#d4af37;margin-top:16px;"></div>

          <!-- FOOTER -->
          <div style="margin-top:28px;display:flex;justify-content:space-between;align-items:flex-end;">
            <div style="font-size:13px;line-height:1.8;">
              <div><strong>Date:</strong> ${date}</div>
              <div><strong>Time:</strong> ${time}</div>
              <div style="font-size:12px;color:#666;font-style:italic;margin-top:14px;">
                Thank you for your generous donation!
              </div>
            </div>

            <div style="text-align:center;">
              <div style="
                width:90px;
                height:90px;
                border:2px dashed #b8860b;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#b8860b;
                font-size:12px;
                font-weight:700;
                margin-left:auto;
                margin-bottom:14px;
              ">
                Official Seal
              </div>
              <div style="font-size:16px;font-weight:800;color:#8b3f17;">
                श्री श्याम जी सेवा समिति
              </div>
            </div>
          </div>

          <div style="
            margin-top:auto;
            border-top:1px dashed #999;
            padding-top:12px;
            text-align:center;
            font-size:11px;
            color:#666;
            line-height:1.65;
          ">
            <div>1. Cheque/DD is Subject to realisation &nbsp;&nbsp; 2. This is a system generated receipt.</div>
            <div>✓ This is a system generated receipt. No physical signature required.</div>
            <div>Generated on ${date}, ${time}</div>
          </div>

        </div>
      </div>
    `;
  }

  private sectionTitle(icon: string, title: string): string {
    return `
      <div style="margin-bottom:22px;">
        <div style="
          font-size:16px;
          font-weight:800;
          color:#8b3f17;
          display:flex;
          align-items:center;
          gap:8px;
        ">
          <span>${icon}</span>
          <span>${title}</span>
        </div>
        <div style="height:2px;background:#c69a1b;margin-top:10px;"></div>
      </div>
    `;
  }

  private infoRow(label: string, value: any): string {
    return `
      <div style="
        display:grid;
        grid-template-columns:125px 14px 1fr;
        gap:5px;
        margin-bottom:13px;
        font-size:12.5px;
        line-height:1.42;
      ">
        <div style="font-weight:700;">${this.safe(label)}</div>
        <div>:</div>
        <div style="word-break:break-word;">${this.safe(value)}</div>
      </div>
    `;
  }

  private fullRow(label: string, value: any): string {
    return `
      <div style="
        display:grid;
        grid-template-columns:275px 16px 1fr;
        gap:6px;
        margin-bottom:11px;
        line-height:1.45;
      ">
        <div style="font-weight:700;">${this.safe(label)}</div>
        <div>:</div>
        <div>${this.safe(value)}</div>
      </div>
    `;
  }

  private safe(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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

  private numberToWordsIndian(num: number): string {
    num = Math.floor(Number(num || 0));
    if (!num) return 'Zero';

    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
      'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const words = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      }
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + words(n % 100) : '');
    };

    let result = '';

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    if (crore) result += words(crore) + ' Crore ';
    if (lakh) result += words(lakh) + ' Lakh ';
    if (thousand) result += words(thousand) + ' Thousand ';
    if (num) result += words(num);

    return result.trim();
  }
}