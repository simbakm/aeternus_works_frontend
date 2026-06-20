import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService, RenovationIdea, RenovationTip } from '../../../services/data.service';

@Component({
  selector: 'app-manage-renovations',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-renovations.component.html',
  styleUrl: './manage-renovations.component.css'
})
export class ManageRenovationsComponent implements OnInit {
  ideas: RenovationIdea[] = [];
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  isSubmitted = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  formErrorMessage = '';
  currentIdea: RenovationIdea = this.getEmptyIdea();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadIdeas();
  }

  loadIdeas(): void {
    this.isLoading = true;
    this.dataService.getRenovationIdeas().subscribe({
      next: ideas => { this.ideas = ideas; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  getEmptyIdea(): RenovationIdea {
    return {
      title: '',
      category: '',
      description: '',
      imageUrl: '',
      beforeImageUrl: '',
      afterImageUrl: '',
      tips: [{ tipText: '' }, { tipText: '' }, { tipText: '' }],
      advice: ''
    };
  }

  openAddModal(): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentIdea = this.getEmptyIdea();
  }

  openEditModal(idea: RenovationIdea): void {
    this.resetModalState();
    this.isEditing = true;
    // Normalize tips - backend may return objects or strings
    const normalizeTip = (t: any): RenovationTip => {
      if (typeof t === 'string') return { tipText: t };
      return { tipText: t?.tipText || '', id: t?.id, sortOrder: t?.sortOrder };
    };
    const existingTips = idea.tips && idea.tips.length > 0
      ? idea.tips.map(normalizeTip)
      : [];
    // Pad to at least 3 slots
    while (existingTips.length < 3) existingTips.push({ tipText: '' });

    this.currentIdea = {
      ...idea,
      beforeImageUrl: idea.beforeImageUrl || '',
      afterImageUrl: idea.afterImageUrl || '',
      tips: existingTips,
      advice: idea.advice || '',
      imageUrl: idea.imageUrl || ''
    };
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

  saveIdea(ideaForm: any): void {
    if (ideaForm.valid) {
      this.formErrorMessage = '';
      this.isSubmitting = true;
      const ideaToSave = {
        ...this.currentIdea,
        tips: this.currentIdea.tips.filter(t => t.tipText && t.tipText.trim() !== '')
      };
      this.dataService.saveRenovationIdea(ideaToSave).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.popupType = 'success';
          this.popupMessage = 'Renovation idea saved successfully.';
          this.isSubmitted = true;
          this.loadIdeas();
        },
        error: () => {
          this.isSubmitting = false;
          this.popupType = 'error';
          this.popupMessage = 'Unable to save the renovation idea. Please try again later.';
          this.isSubmitted = true;
        }
      });
    } else {
      this.formErrorMessage = 'Please fill in all required fields before saving this renovation idea.';
      this.popupType = 'error';
      this.popupMessage = 'Please fill in all required fields before saving this renovation idea.';
      this.isSubmitted = true;
      ideaForm.form.markAllAsTouched();
    }
  }

  resetModalState(): void {
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.popupMessage = '';
    this.popupType = 'success';
    this.formErrorMessage = '';
  }

  deleteIdea(id: string): void {
    if (confirm('Are you sure you want to delete this renovation idea?')) {
      this.dataService.deleteRenovationIdea(id).subscribe(() => this.loadIdeas());
    }
  }

  onImageSelected(event: Event, field: 'imageUrl' | 'beforeImageUrl' | 'afterImageUrl'): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentIdea[field] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addTip(): void {
    this.currentIdea.tips.push({ tipText: '' });
  }

  removeTip(index: number): void {
    this.currentIdea.tips.splice(index, 1);
  }
}
