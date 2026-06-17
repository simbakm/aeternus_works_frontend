import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Project } from '../../../services/data.service';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css'
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];
  
  isEditing = false;
  currentProject: Project = this.getEmptyProject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects = this.dataService.getProjects();
  }

  getEmptyProject(): Project {
    return {
      id: '',
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
    this.isEditing = true;
    this.currentProject = this.getEmptyProject();
    this.currentProject.id = 'p' + new Date().getTime(); // Simple ID generation
  }

  openEditModal(project: Project): void {
    this.isEditing = true;
    this.currentProject = { ...project, images: project.images ? [...project.images] : [] };
  }

  closeModal(): void {
    this.isEditing = false;
  }

  saveProject(): void {
    this.dataService.saveProject(this.currentProject);
    this.loadProjects();
    this.closeModal();
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dataService.deleteProject(id);
      this.loadProjects();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.currentProject.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.currentProject.images.splice(index, 1);
  }
}
