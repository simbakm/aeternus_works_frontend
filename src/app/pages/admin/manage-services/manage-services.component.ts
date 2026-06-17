import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, ServiceInfo } from '../../../services/data.service';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css'
})
export class ManageServicesComponent implements OnInit {
  services: ServiceInfo[] = [];
  
  isEditing = false;
  currentService: ServiceInfo = this.getEmptyService();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.services = this.dataService.getServices();
  }

  getEmptyService(): ServiceInfo {
    return {
      id: '',
      title: '',
      icon: '',
      description: '',
      benefits: [],
      process: [],
      faqs: [],
      image: ''
    };
  }

  openAddModal(): void {
    this.isEditing = true;
    this.currentService = this.getEmptyService();
    this.currentService.id = 's' + new Date().getTime();
  }

  openEditModal(service: ServiceInfo): void {
    this.isEditing = true;
    this.currentService = JSON.parse(JSON.stringify(service)); // Deep copy to avoid modifying original before save
  }

  closeModal(): void {
    this.isEditing = false;
  }

  saveService(): void {
    // For simplicity, we are assuming benefits are comma-separated strings if edited
    if (typeof this.currentService.benefits === 'string') {
      this.currentService.benefits = (this.currentService.benefits as string).split(',').map(s => s.trim());
    }

    this.dataService.saveService(this.currentService);
    this.loadServices();
    this.closeModal();
  }

  deleteService(id: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.dataService.deleteService(id);
      this.loadServices();
    }
  }

  get benefitsAsString(): string {
    return Array.isArray(this.currentService.benefits) ? this.currentService.benefits.join(', ') : this.currentService.benefits;
  }

  set benefitsAsString(val: string) {
    this.currentService.benefits = val.split(',').map(s => s.trim());
  }

  // Helpers for nested arrays (simplified for this prototype)
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

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentService.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
