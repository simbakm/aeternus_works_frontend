import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService, Project, ProjectImage } from '../../../services/data.service';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css'
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  isSubmitted = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  formErrorMessage = '';
  currentProject: Project = this.getEmptyProject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.dataService.getProjects().subscribe({
      next: projects => { this.projects = projects; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  getEmptyProject(): Project {
    return {
      title: '',
      category: '',
      location: '',
      description: '',
      images: [],
      status: 'Upcoming',
      date: ''
    };
  }

  openAddModal(): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentProject = this.getEmptyProject();
  }

  openEditModal(project: Project): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentProject = { ...project, images: project.images ? [...project.images] : [] };
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

  saveProject(projectForm: any): void {
    if (projectForm.valid) {
      this.formErrorMessage = '';
      this.isSubmitting = true;
      this.dataService.saveProject(this.currentProject).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.popupType = 'success';
          this.popupMessage = 'Project saved successfully.';
          this.isSubmitted = true;
          this.loadProjects();
        },
        error: () => {
          this.isSubmitting = false;
          this.popupType = 'error';
          this.popupMessage = 'Unable to save the project. Please try again later.';
          this.isSubmitted = true;
        }
      });
    } else {
      this.formErrorMessage = 'Please fill in all required fields before saving this project.';
      this.popupType = 'error';
      this.popupMessage = 'Please fill in all required fields before saving this project.';
      this.isSubmitted = true;
      projectForm.form.markAllAsTouched();
    }
  }

  resetModalState(): void {
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.popupMessage = '';
    this.popupType = 'success';
    this.formErrorMessage = '';
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dataService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }

  addImageUrl(url: string): void {
    if (url) {
      const img: ProjectImage = { imageUrl: url, sortOrder: this.currentProject.images.length };
      this.currentProject.images.push(img);
    }
  }

  removeImage(index: number): void {
    this.currentProject.images.splice(index, 1);
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.addImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}


