import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = false;
  pendingInquiryCount = 0;
  isUserMenuOpen = false;
  username = '';
  isSuperAdmin = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.updateNotificationCount();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNotificationCount();
        this.isUserMenuOpen = false;
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

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  navigateNotifications(): void {
    const queryParams = this.pendingInquiryCount > 0 ? { focus: 'pending' } : {};
    this.router.navigate(['/admin/inquiries'], { queryParams });
  }

  navigateSettings(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/admin/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.isUserMenuOpen = false;
    }
  }
}
