
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InvoicePdf {

  /**
   * Receipt object lo, HTML banao, jsPDF se PDF generate karo
   * aur automatically download karo.
   *
   * Dependencies install karo:
   *   npm install jspdf html2canvas
   */
  async downloadPdf(receipt: any): Promise<void> {
    // Dynamic import — lazy load karta hai, bundle size avoid hoti hai
    const [jsPDFModule, html2canvasModule] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    const jsPDF      = jsPDFModule.default;
    const html2canvas = html2canvasModule.default;

    // ── Temporary hidden div banao DOM mein ──────────────────
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 900px;
      background: white;
      z-index: -1;
    `;
    container.innerHTML = this.buildInvoiceHtml(receipt);
    document.body.appendChild(container);

    try {
      // ── html2canvas se screenshot lo ────────────────────────
      const canvas = await html2canvas(container, {
        scale: 2,                  // high resolution
        useCORS: true,             // cross-origin images (logo)
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 900,
      });

      // ── A4 size mein fit karo ────────────────────────────────
      const imgData   = canvas.toDataURL('image/png');
      const pdf       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgWidth  = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // Agar content ek page se zyada ho toh multiple pages
      let heightLeft = imgHeight;
      let position   = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // ── Download ─────────────────────────────────────────────
      pdf.save(`${receipt.invoiceNumber || 'invoice'}.pdf`);

    } finally {
      document.body.removeChild(container);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Invoice HTML builder — same design jaise server pe hai
  // ══════════════════════════════════════════════════════════════
  private buildInvoiceHtml(r: any): string {
    const invoiceDate = new Date(r.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const invoiceTime = new Date(r.createdAt).toLocaleTimeString('en-IN');

    const campaign       = r.campaignId || r.campaign || null;
    const donorMessage   = r.donorMessage
      ? `<div class="detail-row"><span class="detail-label">Message:</span><span class="detail-value">${r.donorMessage}</span></div>`
      : '';
    const campaignExtras = campaign
      ? `<div class="detail-row"><span class="detail-label">Goal Amount:</span><span class="detail-value">&#8377;${Number(campaign.goal).toFixed(2)}</span></div>
         <div class="detail-row"><span class="detail-label">Days Left:</span><span class="detail-value">${campaign.daysLeft ?? '—'} days</span></div>`
      : '';
    const remainingRow = campaign
      ? `<div class="amount-row">
           <span class="amount-label">Remaining Goal:</span>
           <span class="amount-value">&#8377;${Number(Math.max(0, campaign.goal - campaign.raised)).toFixed(2)}</span>
         </div>`
      : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #333; padding: 30px; }
  .invoice-container { max-width: 860px; margin: auto; background: white; padding: 40px; }
  .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #d4af37; padding-bottom: 20px; }
  .logo-section { display: flex; align-items: center; gap: 15px; }
  .logo-section img { width: 75px; height: 75px; object-fit: contain; }
  .company-name { font-size: 26px; font-weight: bold; color: #8b4513; margin-bottom: 4px; }
  .company-tagline { font-size: 12px; color: #666; font-style: italic; }
  .invoice-title-section { text-align: right; }
  .invoice-title { font-size: 30px; font-weight: bold; color: #d4af37; margin-bottom: 8px; }
  .invoice-number { font-size: 13px; color: #666; margin-bottom: 4px; }
  .invoice-main { display: flex; gap: 40px; margin-bottom: 30px; }
  .section { flex: 1; min-width: 0; }
  .section-title { font-size: 12px; font-weight: bold; color: #8b4513; text-transform: uppercase; margin-bottom: 14px; border-bottom: 2px solid #d4af37; padding-bottom: 8px; }
  .detail-row { display: flex; margin-bottom: 8px; font-size: 13px; }
  .detail-label { font-weight: 600; width: 120px; min-width: 120px; color: #333; }
  .detail-value { flex: 1; color: #555; word-break: break-word; }
  .amount-section { background: #f9f9f9; padding: 24px; border-radius: 4px; margin: 28px 0; border-left: 5px solid #d4af37; }
  .amount-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
  .amount-label { font-weight: 600; color: #333; }
  .amount-value { color: #555; }
  .donation-amount { display: flex; justify-content: space-between; font-size: 22px; font-weight: bold; color: #8b4513; border-top: 2px solid #d4af37; padding-top: 14px; margin-top: 14px; }
  .invoice-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 18px; border-top: 2px solid #eee; }
  .footer-left { font-size: 12px; color: #666; }
  .footer-date { display: block; margin-bottom: 8px; }
  .footer-note { font-size: 11px; color: #999; font-style: italic; margin-top: 8px; }
  .mohar { width: 90px; height: 90px; border: 2px dashed #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #d4af37; font-weight: bold; text-align: center; }
  .organization-name { font-size: 13px; font-weight: bold; color: #8b4513; margin-top: 6px; text-align: center; }
  .system-notice { text-align: center; margin-top: 28px; font-size: 10px; color: #999; border-top: 1px dashed #ddd; padding-top: 14px; }
</style>
</head>
<body>
<div class="invoice-container">

  <div class="invoice-header">
    <div class="logo-section">
      <img src="https://shyamjisewasamiti.org/assets/logo/logo.svg" alt="Logo" crossorigin="anonymous" />
      <div>
        <div class="company-name">श्री श्याम जी सेवा समिति</div>
        <div class="company-tagline">Shree Shyam Ji Sewa Samiti</div>
      </div>
    </div>
    <div class="invoice-title-section">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">Invoice #: ${r.invoiceNumber}</div>
      <div class="invoice-number">Receipt ID: ${r._id}</div>
    </div>
  </div>

  <div class="invoice-main">
    <div class="section">
      <div class="section-title">💳 Donor Information</div>
      <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value">${r.donorFullName || 'Anonymous'}</span></div>
      <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${r.donorEmail || '—'}</span></div>
      <div class="detail-row"><span class="detail-label">Contact:</span><span class="detail-value">${r.donorCountryCode || '+91'} ${r.donorMobile || '—'}</span></div>
      <div class="detail-row"><span class="detail-label">Address:</span><span class="detail-value">${r.donorAddress || '—'}</span></div>
      <div class="detail-row"><span class="detail-label">Nationality:</span><span class="detail-value">${r.donorNationality || 'India'}</span></div>
      <div class="detail-row"><span class="detail-label">PAN:</span><span class="detail-value">${r.donorPAN || '—'}</span></div>
      ${donorMessage}
    </div>
    <div class="section">
      <div class="section-title">🏛️ Donation For</div>
      <div class="detail-row"><span class="detail-label">Campaign:</span><span class="detail-value">${campaign?.title || 'General Donation'}</span></div>
      <div class="detail-row"><span class="detail-label">Description:</span><span class="detail-value">${campaign?.description || 'Religious & Social Service'}</span></div>
      <div class="detail-row"><span class="detail-label">Payment ID:</span><span class="detail-value">${r.razorpay_payment_id || '—'}</span></div>
      <div class="detail-row"><span class="detail-label">Order ID:</span><span class="detail-value">${r.razorpay_order_id || '—'}</span></div>
      <div class="detail-row"><span class="detail-label">Currency:</span><span class="detail-value">${r.currency || 'INR'}</span></div>
      ${campaignExtras}
    </div>
  </div>

  <div class="amount-section">
    <div class="amount-row">
      <span class="amount-label">Donation Amount:</span>
      <span class="amount-value">&#8377;${Number(r.amount).toFixed(2)}</span>
    </div>
    ${remainingRow}
    <div class="donation-amount">
      <span>Total Amount:</span>
      <span style="color:#27ae60;">&#8377;${Number(r.amount).toFixed(2)}</span>
    </div>
  </div>

  <div class="invoice-footer">
    <div class="footer-left">
      <span class="footer-date"><strong>Date:</strong> ${invoiceDate}</span>
      <span class="footer-date"><strong>Time:</strong> ${invoiceTime}</span>
      <div class="footer-note">Thank you for your generous donation!</div>
    </div>
    <div class="footer-right">
      <div class="mohar"><span>Official<br>Seal</span></div>
      <div class="organization-name">श्री श्याम जी<br>सेवा समिति</div>
    </div>
  </div>

  <div class="system-notice">
    ✓ This is a system-generated invoice. No physical signature required. | Generated on ${new Date().toLocaleString('en-IN')}
  </div>

</div>
</body>
</html>`;
  }
}