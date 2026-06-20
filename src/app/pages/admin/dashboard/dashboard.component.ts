import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { DataService } from '../../../services/data.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isBrowser = false;

  totalProjects = 0;
  completedProjects = 0;
  ongoingProjects = 0;
  pendingInquiries = 0;

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
      this.pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
    });

    if (this.isBrowser) {
      this.lineChartData = this.dataService.getSiteTrafficData();
      this.barChartData = this.dataService.getInquiriesAnalyticsData();
    }
  }
}
