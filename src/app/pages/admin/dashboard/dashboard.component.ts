import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { DataService, Inquiry } from '../../../services/data.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isBrowser = false;

  totalProjects = 0;
  completedProjects = 0;
  ongoingProjects = 0;
  pendingInquiries = 0;
  inquiriesList: Inquiry[] = [];
  inquiryViewMode: 'day' | 'week' | 'month' = 'day';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      x: { grid: { color: '#1f293d' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1f293d' }, ticks: { color: '#94a3b8' } }
    }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      x: { grid: { color: '#1f293d' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1f293d' }, ticks: { color: '#94a3b8' } }
    }
  };

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.totalProjects = projects.length;
      this.completedProjects = projects.filter(p => p.status === 'Completed').length;
      this.ongoingProjects = projects.filter(p => p.status === 'Ongoing').length;
    });

    this.dataService.getInquiries().subscribe(inquiries => {
      this.inquiriesList = inquiries;
      this.pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
      if (this.isBrowser) {
        this.updateInquiriesChart();
      }
    });

    if (this.isBrowser) {
      this.lineChartData = this.dataService.getSiteTrafficData();
      // barChartData is initially empty, will be populated when inquiries are loaded
    }
  }

  updateInquiriesChart() {
    let labels: string[] = [];
    let counts: number[] = [];
    
    const now = new Date();
    
    if (this.inquiryViewMode === 'day') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        counts.push(0);
      }
      
      this.inquiriesList.forEach(inq => {
        if (!inq.date) return;
        const d = new Date(inq.date);
        const l = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const index = labels.indexOf(l);
        if (index !== -1) {
          counts[index]++;
        }
      });
    } else if (this.inquiryViewMode === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - (i * 7));
        d.setDate(d.getDate() - d.getDay()); // Sunday
        labels.push('Week of ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        counts.push(0);
      }
      
      this.inquiriesList.forEach(inq => {
        if (!inq.date) return;
        const d = new Date(inq.date);
        d.setDate(d.getDate() - d.getDay());
        const l = 'Week of ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const index = labels.indexOf(l);
        if (index !== -1) {
          counts[index]++;
        }
      });
    } else if (this.inquiryViewMode === 'month') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        counts.push(0);
      }
      
      this.inquiriesList.forEach(inq => {
        if (!inq.date) return;
        const d = new Date(inq.date);
        const l = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const index = labels.indexOf(l);
        if (index !== -1) {
          counts[index]++;
        }
      });
    }

    this.barChartData = {
      labels: labels,
      datasets: [{
        data: counts,
        label: 'Inquiries',
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }]
    };
  }
}
