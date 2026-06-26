import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService, AdminUser, CreatedCredentials } from '../../../services/admin-user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  admins: AdminUser[] = [];
  isLoading = false;
  isSuperAdmin = false;
  currentUsername = '';

  // Create modal
  showCreateModal = false;
  createForm = { username: '', email: '', role: 'ADMIN' };
  isCreating = false;
  createError = '';

  // Credentials modal (shown after create)
  showCredentialsModal = false;
  newCredentials: CreatedCredentials | null = null;
  credentialsCopied = false;
  isSendingEmail = false;
  emailSent = false;
  emailError = '';
  newAdminId = '';

  // Edit modal
  showEditModal = false;
  editForm = { id: '', username: '', email: '', role: '' };
  isEditing = false;
  editError = '';

  // Delete confirmation
  showDeleteModal = false;
  adminToDelete: AdminUser | null = null;
  isDeleting = false;

  // Toast
  toast = { show: false, message: '', type: 'success' };

  constructor(
    private adminUserService: AdminUserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.currentUsername = this.authService.getUsername();
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading = true;
    this.adminUserService.getAll().subscribe({
      next: (data) => {
        this.admins = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Failed to load admin users', 'error');
      }
    });
  }

  // --- Create ---
  openCreateModal(): void {
    this.createForm = { username: '', email: '', role: 'ADMIN' };
    this.createError = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createError = '';
  }

  submitCreate(): void {
    if (!this.createForm.username || !this.createForm.email) {
      this.createError = 'Username and email are required.';
      return;
    }
    this.isCreating = true;
    this.createError = '';
    this.adminUserService.create(this.createForm).subscribe({
      next: (creds) => {
        this.isCreating = false;
        this.showCreateModal = false;
        this.newCredentials = creds;
        this.credentialsCopied = false;
        this.emailSent = false;
        this.emailError = '';
        // Find the newly created user's ID
        this.adminUserService.getAll().subscribe(data => {
          this.admins = data;
          const found = data.find(a => a.username === creds.username);
          this.newAdminId = found ? found.id : '';
        });
        this.showCredentialsModal = true;
      },
      error: (err) => {
        this.isCreating = false;
        this.createError = err?.error?.error || 'Failed to create admin user';
      }
    });
  }

  // --- Credentials ---
  copyCredentials(): void {
    if (!this.newCredentials) return;
    const text = `Username: ${this.newCredentials.username}\nEmail: ${this.newCredentials.email}\nPassword: ${this.newCredentials.password}\nRole: ${this.newCredentials.role}`;
    navigator.clipboard.writeText(text).then(() => {
      this.credentialsCopied = true;
      setTimeout(() => this.credentialsCopied = false, 3000);
    });
  }

  sendCredentialsByEmail(): void {
    if (!this.newAdminId || !this.newCredentials) return;
    this.isSendingEmail = true;
    this.emailError = '';
    this.adminUserService.sendCredentials(this.newAdminId, this.newCredentials.password).subscribe({
      next: () => {
        this.isSendingEmail = false;
        this.emailSent = true;
        this.showToast('Credentials sent via email!', 'success');
      },
      error: (err) => {
        this.isSendingEmail = false;
        this.emailError = err?.error?.error || 'Failed to send email';
      }
    });
  }

  closeCredentialsModal(): void {
    this.showCredentialsModal = false;
    this.newCredentials = null;
  }

  // --- Edit ---
  openEditModal(admin: AdminUser): void {
    this.editForm = { id: admin.id, username: admin.username, email: admin.email, role: admin.role };
    this.editError = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editError = '';
  }

  submitEdit(): void {
    if (!this.editForm.username || !this.editForm.email) {
      this.editError = 'Username and email are required.';
      return;
    }
    this.isEditing = true;
    this.editError = '';
    this.adminUserService.update(this.editForm.id, {
      username: this.editForm.username,
      email: this.editForm.email,
      role: this.editForm.role
    }).subscribe({
      next: () => {
        this.isEditing = false;
        this.showEditModal = false;
        this.loadAdmins();
        this.showToast('Admin user updated successfully', 'success');
      },
      error: (err) => {
        this.isEditing = false;
        this.editError = err?.error?.error || 'Failed to update admin user';
      }
    });
  }

  // --- Delete ---
  openDeleteModal(admin: AdminUser): void {
    this.adminToDelete = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.adminToDelete = null;
  }

  confirmDelete(): void {
    if (!this.adminToDelete) return;
    this.isDeleting = true;
    this.adminUserService.delete(this.adminToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.adminToDelete = null;
        this.loadAdmins();
        this.showToast('Admin user deleted', 'success');
      },
      error: () => {
        this.isDeleting = false;
        this.showToast('Failed to delete admin user', 'error');
      }
    });
  }

  // --- Toast ---
  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { show: true, message, type };
    setTimeout(() => this.toast.show = false, 4000);
  }

  getRoleBadgeClass(role: string): string {
    return role === 'SUPER_ADMIN' ? 'badge-super-admin' : 'badge-admin';
  }

  getRoleLabel(role: string): string {
    return role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';
  }

  formatDate(date: string | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
