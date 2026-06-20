import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService, ServiceInfo } from '../../../services/data.service';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css'
})
export class ManageServicesComponent implements OnInit {
  services: ServiceInfo[] = [];
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  isSubmitted = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  formErrorMessage = '';
  currentService: ServiceInfo = this.getEmptyService();
  iconOptions = [
    { value: 'building', label: 'Building', preview: '🏗️' },
    { value: 'renovation', label: 'Renovation', preview: '🔨' },
    { value: 'civil', label: 'Civil Works', preview: '🛣️' },
    { value: 'project-management', label: 'Project Mgmt', preview: '📋' },
    { value: 'masonry', label: 'Masonry', preview: '🧱' },
    { value: 'plumbing', label: 'Plumbing', preview: '🔧' },
    { value: 'generic', label: 'Generic', preview: '🛠️' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.dataService.getServices().subscribe({
      next: services => { this.services = services; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  getEmptyService(): ServiceInfo {
    return {
      title: '',
      icon: '',
      description: '',
      benefits: [],
      process: [],
      faqs: [],
      imageUrl: ''
    };
  }

  openAddModal(): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentService = this.getEmptyService();
  }

  openEditModal(service: ServiceInfo): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentService = JSON.parse(JSON.stringify(service));
  }

  selectIcon(iconValue: string): void {
    this.currentService.icon = iconValue;
  }

  getIconPreview(icon?: string): string {
    if (!icon) {
      return '🛠️';
    }
    const normalized = icon.startsWith('icon-') ? icon.replace('icon-', '') : icon;
    const entry = this.iconOptions.find(option => option.value === icon || option.value === normalized);
    return entry ? entry.preview : '🛠️';
  }

  closeModal(): void {
    this.isEditing = false;
    this.resetModalState();
  }

  closePopup(): void {
    if (this.popupType === 'success') {
      this.closeModal();
    } else {
      this.isSubmitted = false;
      this.popupMessage = '';
      this.formErrorMessage = '';
    }
  }

  saveService(serviceForm: NgForm): void {
    if (serviceForm.valid) {
      this.formErrorMessage = '';
      this.isSubmitting = true;
      if (typeof this.currentService.benefits === 'string') {
        this.currentService.benefits = (this.currentService.benefits as string).split(',').map(s => s.trim());
      }

      this.dataService.saveService(this.currentService).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.popupType = 'success';
          this.popupMessage = 'Service saved successfully.';
          this.isSubmitted = true;
          this.loadServices();
        },
        error: () => {
          this.isSubmitting = false;
          this.popupType = 'error';
          this.popupMessage = 'Unable to save the service. Please try again later.';
          this.isSubmitted = true;
        }
      });
    } else {
      this.formErrorMessage = 'Please fill in all required fields before saving this service.';
      this.popupType = 'error';
      this.popupMessage = 'Please fill in all required fields before saving this service.';
      this.isSubmitted = true;
      serviceForm.form.markAllAsTouched();
    }
  }

  resetModalState(): void {
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.popupMessage = '';
    this.popupType = 'success';
    this.formErrorMessage = '';
  }

  deleteService(id: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.dataService.deleteService(id).subscribe(() => this.loadServices());
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentService.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  get benefitsAsString(): string {
    return Array.isArray(this.currentService.benefits) ? this.currentService.benefits.join(', ') : this.currentService.benefits;
  }

  set benefitsAsString(val: string) {
    this.currentService.benefits = val.split(',').map(s => s.trim());
  }

  addProcessStep(): void {
    this.currentService.process.push({ title: '', description: '' });
  }

  removeProcessStep(index: number): void {
    this.currentService.process.splice(index, 1);
  }

  addFaq(): void {
    this.currentService.faqs.push({ question: '', answer: '' });
  }

  removeFaq(index: number): void {
    this.currentService.faqs.splice(index, 1);
  }
}
