import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = false;
  pendingInquiryCount = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateNotificationCount();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNotificationCount();
      }
    });
  }

  updateNotificationCount(): void {
    this.dataService.getPendingInquiryCount().subscribe(count => this.pendingInquiryCount = count);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  navigateNotifications(): void {
    const queryParams = this.pendingInquiryCount > 0 ? { focus: 'pending' } : {};
    this.router.navigate(['/admin/inquiries'], { queryParams });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
