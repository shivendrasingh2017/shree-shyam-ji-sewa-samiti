import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration, Chart,
  BarController, LineController, DoughnutController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend
} from 'chart.js';
import { CampaignService } from '../../services/campaign';
import { ReceiptService } from '../../services/receipt';
import { GalleryService, GalleryItem } from '../../services/gallery.service';
import { AuthService } from '../../services/auth';
import { InvoicePdf } from '../../services/invoice-pdf';

// ── Chart.js controllers & elements register karo ───────────
Chart.register(
  BarController, LineController, DoughnutController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend
);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit, OnDestroy {
  // auth
  user = '';
  pass = '';
  loggedIn = !!localStorage.getItem('admin_token');

  // campaigns
  campaigns: any[] = [];
  editId: string | null = null;
  title = '';
  description = '';
  icon = '🛕';
  goal = 100000;
  daysLeft = 30;

  // receipts
  receipts: any[] = [];
  failedReceipts: any[] = [];
  currentReceiptPage = 1;
  currentFailedPage = 1;
  receiptLimit = 10;
  receiptPagination: any = { total: 0, pages: 0 };
  failedPagination: any = { total: 0, pages: 0 };

  // admin users
  admins: any[] = [];

  // dashboard stats
  totalRaised = 0;
  totalDonors = 0;
  avgDonation = 0;
  activeCampaigns = 0;

  // chart configurations
  campaignChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  donationTrendChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  campaignPerformanceChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  donationSourceChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  campaignChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#555', font: { size: 12 }, padding: 16, boxWidth: 14 }
      },
      tooltip: {
        backgroundColor: 'rgba(30,30,60,0.92)',
        titleColor: '#fff',
        bodyColor: '#e0e0ff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#888', font: { size: 11 }, maxRotation: 30 },
        grid: { color: 'rgba(0,0,0,0.04)' }
      },
      y: {
        ticks: {
          color: '#888',
          font: { size: 11 },
          callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
        },
        grid: { color: 'rgba(0,0,0,0.06)' }
      }
    }
  };

  donationTrendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#555', font: { size: 12 }, padding: 16, boxWidth: 14 }
      },
      tooltip: {
        backgroundColor: 'rgba(30,30,60,0.92)',
        titleColor: '#fff',
        bodyColor: '#e0e0ff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#888', font: { size: 11 }, maxRotation: 30 },
        grid: { color: 'rgba(0,0,0,0.04)' }
      },
      y: {
        ticks: {
          color: '#888',
          font: { size: 11 },
          callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
        },
        grid: { color: 'rgba(0,0,0,0.06)' }
      }
    }
  };

  campaignPerformanceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#555', font: { size: 12 }, padding: 16, boxWidth: 14 }
      },
      tooltip: {
        backgroundColor: 'rgba(30,30,60,0.92)',
        titleColor: '#fff',
        bodyColor: '#e0e0ff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.raw}% completed`
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          color: '#888',
          font: { size: 11 },
          callback: (val) => `${val}%`
        },
        grid: { color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        ticks: { color: '#666', font: { size: 11 } },
        grid: { color: 'transparent' }
      }
    }
  };

  donationSourceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#555',
          font: { size: 11 },
          padding: 12,
          boxWidth: 12,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return (data.labels as string[]).map((label, i) => ({
                text: label.length > 18 ? label.substring(0, 16) + '…' : label,
                fillStyle: (data.datasets[0].backgroundColor as string[])[i],
                strokeStyle: (data.datasets[0].backgroundColor as string[])[i],
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30,30,60,0.92)',
        titleColor: '#fff',
        bodyColor: '#e0e0ff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.raw} donors`
        }
      }
    }
  };

  currentTab = 'dashboard';
  showNewCampaignModal = false;

  // gallery admin
  galleryItems: GalleryItem[] = [];
  showGalleryModal = false;
  galleryTitle = '';
  galleryDescription = '';
  galleryImageUrl = '';
  galleryItemId: string | null = null;
  galleryStatus: 'active' | 'inactive' = 'active';
  galleryPreviewError = '';
  gallerySelectedFile: File | null = null;

  constructor(
    private campaignService: CampaignService,
    private receiptService: ReceiptService,
    private galleryService: GalleryService,
    private auth: AuthService,
    private invoicePdf: InvoicePdf
  ) { }

  ngOnInit() {
    this.loadCampaigns();
    if (this.loggedIn) {
      this.loadReceipts();
      this.loadFailedReceipts();
      this.loadAdmins();
      this.loadDashboard();
    }
  }

  // ── Auto-logout jab component destroy ho ──
  ngOnDestroy() {
    if (this.loggedIn) {
      this.logout();
    }
  }

  login() {
    this.auth.login(this.user, this.pass).subscribe((res: any) => {
      if (res && res.token) {
        localStorage.setItem('admin_token', res.token);
        this.loggedIn = true;
        this.pass = '';
        this.loadReceipts();
        this.loadFailedReceipts();
        this.loadCampaigns();
        this.loadAdmins();
        this.loadDashboard();
      }
    }, () => alert('Login failed'));
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.loggedIn = false;
    this.receipts = [];
    this.failedReceipts = [];
    this.currentTab = 'dashboard';
  }

  loadCampaigns() {
    this.campaignService.list().subscribe((res: any) => {
      if (res && res.success) {
        this.campaigns = res.data;
        this.updateCharts();
      }
    });
  }

  loadDashboard() {
    this.calculateStats();
    this.prepareCharts();
  }

  calculateStats() {
    this.totalRaised = this.campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    this.totalDonors = this.campaigns.reduce((sum, c) => sum + (c.donors || 0), 0);
    this.avgDonation = this.totalDonors > 0 ? this.totalRaised / this.totalDonors : 0;
    this.activeCampaigns = this.campaigns.filter(c => c.active).length;
  }

  prepareCharts() {
    this.prepareCampaignProgressChart();
    this.prepareDonationTrendChart();
    this.prepareCampaignPerformanceChart();
    this.prepareDonationSourceChart();
  }

  prepareCampaignProgressChart() {
    const top5 = this.campaigns.slice(0, 5);
    const labels = top5.map(c => c.title?.length > 14 ? c.title.substring(0, 12) + '…' : c.title);
    const raised = top5.map(c => c.raised || 0);
    const goals = top5.map(c => c.goal || 0);

    this.campaignChartData = {
      labels,
      datasets: [
        {
          label: 'Amount Raised (₹)',
          data: raised,
          backgroundColor: 'rgba(102,126,234,0.85)',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Goal (₹)',
          data: goals,
          backgroundColor: 'rgba(118,75,162,0.35)',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }

  prepareDonationTrendChart() {
    const dateMap = new Map<string, number>();
    const sortedReceipts = [...this.receipts].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedReceipts.forEach(r => {
      const date = new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      dateMap.set(date, (dateMap.get(date) || 0) + (r.amount || 0));
    });

    const labels = Array.from(dateMap.keys());
    const data = Array.from(dateMap.values());

    this.donationTrendChartData = {
      labels,
      datasets: [
        {
          label: 'Daily Donations (₹)',
          data,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102,126,234,0.12)',
          tension: 0.45,
          fill: true,
          pointBackgroundColor: '#764ba2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    };
  }

  prepareCampaignPerformanceChart() {
    const top5 = this.campaigns.slice(0, 5);
    const labels = top5.map(c => c.title?.length > 18 ? c.title.substring(0, 16) + '…' : c.title);
    const percentages = top5.map(c => {
      const goal = c.goal || 1;
      return Math.min(Math.round((c.raised / goal) * 100), 100);
    });

    this.campaignPerformanceChartData = {
      labels,
      datasets: [
        {
          label: 'Completion %',
          data: percentages,
          backgroundColor: [
            'rgba(102,126,234,0.85)',
            'rgba(118,75,162,0.85)',
            'rgba(255,99,132,0.85)',
            'rgba(54,162,235,0.85)',
            'rgba(255,206,86,0.85)'
          ],
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }

  prepareDonationSourceChart() {
    if (!this.campaigns || this.campaigns.length === 0) return;

    const top5 = this.campaigns.slice(0, 5);
    const labels = top5.map(c => c.title);
    const data = top5.map(c => c.donors || 0);

    this.donationSourceChartData = {
      labels,
      datasets: [
        {
          label: 'Number of Donors',
          data,
          backgroundColor: [
            'rgba(102,126,234,0.88)',
            'rgba(118,75,162,0.88)',
            'rgba(255,99,132,0.88)',
            'rgba(54,162,235,0.88)',
            'rgba(255,159,64,0.88)'
          ],
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8
        }
      ]
    };
  }

  updateCharts() {
    if (this.loggedIn) {
      this.calculateStats();
      this.prepareCharts();
    }
  }

  // ───────── CAMPAIGN MANAGEMENT ─────────
  openNewCampaignModal() {
    this.clearForm();
    this.showNewCampaignModal = true;
  }

  closeNewCampaignModal() {
    this.showNewCampaignModal = false;
    this.clearForm();
  }

  saveCampaign() {
    const payload: any = {
      title: this.title,
      description: this.description,
      icon: this.icon,
      goal: this.goal,
      daysLeft: this.daysLeft,
      raised: 0,
      donors: 0,
      active: false
    };
    if (this.editId) {
      this.campaignService.update(this.editId, payload).subscribe(() => {
        this.clearForm();
        this.loadCampaigns();
      });
    } else {
      this.campaignService.create(payload).subscribe(() => {
        this.clearForm();
        this.closeNewCampaignModal();
        this.loadCampaigns();
      });
    }
  }

  edit(c: any) {
    this.editId = c._id;
    this.title = c.title;
    this.description = c.description;
    this.icon = c.icon;
    this.goal = c.goal;
    this.daysLeft = c.daysLeft;
    this.showNewCampaignModal = true;
  }

  remove(id?: string) {
    if (!id) return;
    if (!confirm('Delete campaign?')) return;
    this.campaignService.delete(id).subscribe(() => this.loadCampaigns());
  }

  toggleCampaignActive(campaign: any) {
    campaign.active = !campaign.active;
    this.campaignService.toggleActive(campaign._id, campaign.active).subscribe(
      () => { this.loadCampaigns(); },
      () => {
        campaign.active = !campaign.active;
        alert('Failed to update campaign status');
      }
    );
  }

  clearForm() {
    this.editId = null;
    this.title = '';
    this.description = '';
    this.icon = '🛕';
    this.goal = 100000;
    this.daysLeft = 30;
  }

  // ───────── RECEIPT MANAGEMENT ─────────
  loadReceipts(page: number = 1) {
    this.currentReceiptPage = page;
    this.receiptService.list(page, this.receiptLimit, 'success').subscribe(
      (res: any) => {
        if (res && res.success) {
          this.receipts = res.data || [];
          if (res.pagination) {
            this.receiptPagination = res.pagination;
          } else {
            const total = res.data?.length || 0;
            const pages = Math.ceil(total / this.receiptLimit) || 1;
            this.receiptPagination = { total, pages, page, limit: this.receiptLimit };
          }
          this.updateCharts();
        }
      },
      (error) => {
        console.error('Error loading receipts:', error);
        this.receipts = [];
        this.receiptPagination = { total: 0, pages: 0, page, limit: this.receiptLimit };
      }
    );
  }

  loadFailedReceipts(page: number = 1) {
    this.currentFailedPage = page;
    this.receiptService.list(page, this.receiptLimit, 'failed').subscribe(
      (res: any) => {
        if (res && res.success) {
          this.failedReceipts = res.data || [];
          if (res.pagination) {
            this.failedPagination = res.pagination;
          } else {
            const total = res.data?.length || 0;
            const pages = Math.ceil(total / this.receiptLimit) || 1;
            this.failedPagination = { total, pages, page, limit: this.receiptLimit };
          }
        }
      },
      (error) => {
        console.error('Error loading failed receipts:', error);
        this.failedReceipts = [];
        this.failedPagination = { total: 0, pages: 0, page, limit: this.receiptLimit };
      }
    );
  }

  exportReceiptsCsv() {
    if (!this.receipts || this.receipts.length === 0) return;
    const header = ['Date', 'Invoice', 'Amount', 'Donor', 'PAN', 'Address', 'Message', 'Campaign', 'Remaining', 'Days Left', 'Order ID', 'Payment ID'];
    const rows = this.receipts.map(r => [
      new Date(r.createdAt).toLocaleString('en-IN'),
      r.invoiceNumber || '',
      r.amount || 0,
      r.donorFullName || 'Anonymous',
      r.donorPAN || '',
      r.donorAddress || '',
      r.donorMessage || '',
      r.campaignId?.title || '',
      r.campaignId ? (r.campaignId.goal - r.campaignId.raised) : 0,
      r.campaignId?.daysLeft || '',
      r.razorpay_order_id || '',
      r.razorpay_payment_id || ''
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `donation_receipts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportFailedReceiptsCsv() {
    if (!this.failedReceipts || this.failedReceipts.length === 0) return;
    const header = ['Donor', 'Pan Card', 'Amount', 'Date', 'Invoice', 'Campaign', 'Address', 'Message', 'Order ID', 'Payment ID'];
    const rows = this.failedReceipts.map(r => [
      r.donorFullName || 'Anonymous',
      r.donorPAN || '',
      r.amount || 0,
      new Date(r.createdAt).toLocaleString('en-IN'),
      r.invoiceNumber || '',
      r.campaignId?.title || '',
      r.donorAddress || '',
      r.donorMessage || '',
      r.razorpay_order_id || '',
      r.razorpay_payment_id || ''
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `failed_payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadInvoice(r: any) {
    if (!r || !r._id) return;
    this.invoicePdf.downloadPdf(r);
  }

  loadAdmins() {
    this.auth.getUsers().subscribe((res: any) => {
      if (res && res.success) {
        this.admins = res.data || [];
      }
    }, () => { this.admins = []; });
  }

  // ───────── GALLERY MANAGEMENT ─────────
  loadGalleryItems() {
    this.galleryService.getAll().subscribe(items => {
      this.galleryItems = items;
    });
  }

  openAddGalleryModal() {
    this.clearGalleryForm();
    this.showGalleryModal = true;
  }

  openEditGalleryModal(item: GalleryItem) {
    this.galleryItemId = item.id;
    this.galleryTitle = item.title;
    this.galleryDescription = item.description;
    this.galleryImageUrl = item.imageUrl;
    this.galleryStatus = item.status;
    this.galleryPreviewError = '';
    this.showGalleryModal = true;
  }

  closeGalleryModal() {
    this.showGalleryModal = false;
    this.clearGalleryForm();
  }

  handleGalleryImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.galleryPreviewError = 'Please select a valid image file.';
      return;
    }
    this.gallerySelectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.galleryImageUrl = reader.result as string;
      this.galleryPreviewError = '';
    };
    reader.readAsDataURL(file);
  }

  saveGalleryItem() {
    if (!this.galleryTitle.trim()) {
      this.galleryPreviewError = 'Title is required.';
      return;
    }
    if (this.galleryItemId) {
      const payload: { title?: string; description?: string; status?: 'active' | 'inactive'; image?: File } = {
        title: this.galleryTitle.trim(),
        description: this.galleryDescription.trim(),
        status: this.galleryStatus,
      };
      if (this.gallerySelectedFile) payload.image = this.gallerySelectedFile;
      this.galleryService.update(this.galleryItemId, payload).subscribe({
        next: () => { this.loadGalleryItems(); this.closeGalleryModal(); },
        error: () => { this.galleryPreviewError = 'Failed to update gallery item.'; }
      });
    } else {
      if (!this.gallerySelectedFile) {
        this.galleryPreviewError = 'Please select an image.';
        return;
      }
      this.galleryService.create({
        title: this.galleryTitle.trim(),
        description: this.galleryDescription.trim(),
        status: this.galleryStatus,
        image: this.gallerySelectedFile
      }).subscribe({
        next: () => { this.loadGalleryItems(); this.closeGalleryModal(); },
        error: (err) => {
          console.error('Gallery create error:', err);
          this.galleryPreviewError = 'Failed to add gallery item.';
        }
      });
    }
  }

  deleteGalleryItem(id: string) {
    if (!confirm('Delete this gallery image?')) return;
    this.galleryService.remove(id).subscribe(() => this.loadGalleryItems());
  }

  toggleGalleryStatus(item: GalleryItem) {
    const newStatus: 'active' | 'inactive' = item.status === 'active' ? 'inactive' : 'active';
    this.galleryService.toggleStatus(item.id, newStatus).subscribe(() => this.loadGalleryItems());
  }

  clearGalleryForm() {
    this.galleryItemId = null;
    this.galleryTitle = '';
    this.galleryDescription = '';
    this.galleryImageUrl = '';
    this.galleryStatus = 'active';
    this.galleryPreviewError = '';
    this.gallerySelectedFile = null;
  }
}