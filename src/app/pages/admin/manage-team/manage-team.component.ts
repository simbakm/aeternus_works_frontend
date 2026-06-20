import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService, TeamMember } from '../../../services/data.service';

@Component({
  selector: 'app-manage-team',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-team.component.html',
  styleUrl: './manage-team.component.css'
})
export class ManageTeamComponent implements OnInit {
  team: TeamMember[] = [];
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  isSubmitted = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  formErrorMessage = '';
  currentMember: TeamMember = this.getEmptyMember();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.isLoading = true;
    this.dataService.getTeamMembers().subscribe({
      next: team => { this.team = team; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  getEmptyMember(): TeamMember {
    return {
      name: '',
      role: '',
      description: '',
      imageUrl: '',
      sortOrder: 0
    };
  }

  openAddModal(): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentMember = this.getEmptyMember();
    this.currentMember.sortOrder = this.team.length;
  }

  openEditModal(member: TeamMember): void {
    this.resetModalState();
    this.isEditing = true;
    this.currentMember = { ...member };
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

  saveMember(teamForm: any): void {
    if (teamForm.valid) {
      this.formErrorMessage = '';
      this.isSubmitting = true;
      this.dataService.saveTeamMember(this.currentMember).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.popupType = 'success';
          this.popupMessage = 'Team member saved successfully.';
          this.isSubmitted = true;
          this.loadTeam();
        },
        error: () => {
          this.isSubmitting = false;
          this.popupType = 'error';
          this.popupMessage = 'Unable to save the team member. Please try again later.';
          this.isSubmitted = true;
        }
      });
    } else {
      this.formErrorMessage = 'Please fill in all required fields before saving this team member.';
      this.popupType = 'error';
      this.popupMessage = 'Please fill in all required fields before saving this team member.';
      this.isSubmitted = true;
      teamForm.form.markAllAsTouched();
    }
  }

  resetModalState(): void {
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.popupMessage = '';
    this.popupType = 'success';
    this.formErrorMessage = '';
  }

  deleteMember(id: string): void {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.dataService.deleteTeamMember(id).subscribe(() => this.loadTeam());
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentMember.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
