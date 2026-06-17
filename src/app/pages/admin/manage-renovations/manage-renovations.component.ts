import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, RenovationIdea } from '../../../services/data.service';

@Component({
  selector: 'app-manage-renovations',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-renovations.component.html',
  styleUrl: './manage-renovations.component.css'
})
export class ManageRenovationsComponent implements OnInit {
  ideas: RenovationIdea[] = [];
  
  isEditing = false;
  currentIdea: RenovationIdea = this.getEmptyIdea();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadIdeas();
  }

  loadIdeas(): void {
    this.ideas = this.dataService.getRenovationIdeas();
  }

  getEmptyIdea(): RenovationIdea {
    return {
      id: '',
      title: '',
      category: '',
      description: '',
      image: ''
    };
  }

  openAddModal(): void {
    this.isEditing = true;
    this.currentIdea = this.getEmptyIdea();
    this.currentIdea.id = 'r' + new Date().getTime();
  }

  openEditModal(idea: RenovationIdea): void {
    this.isEditing = true;
    this.currentIdea = { ...idea };
  }

  closeModal(): void {
    this.isEditing = false;
  }

  saveIdea(): void {
    this.dataService.saveRenovationIdea(this.currentIdea);
    this.loadIdeas();
    this.closeModal();
  }

  deleteIdea(id: string): void {
    if (confirm('Are you sure you want to delete this renovation idea?')) {
      this.dataService.deleteRenovationIdea(id);
      this.loadIdeas();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentIdea.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
