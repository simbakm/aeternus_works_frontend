import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, TeamMember } from '../../../services/data.service';

@Component({
  selector: 'app-manage-team',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-team.component.html',
  styleUrl: './manage-team.component.css'
})
export class ManageTeamComponent implements OnInit {
  team: TeamMember[] = [];
  
  isEditing = false;
  currentMember: TeamMember = this.getEmptyMember();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.team = this.dataService.getTeamMembers();
  }

  getEmptyMember(): TeamMember {
    return {
      id: '',
      name: '',
      role: '',
      description: '',
      image: ''
    };
  }

  openAddModal(): void {
    this.isEditing = true;
    this.currentMember = this.getEmptyMember();
    this.currentMember.id = 't' + new Date().getTime();
  }

  openEditModal(member: TeamMember): void {
    this.isEditing = true;
    this.currentMember = { ...member };
  }

  closeModal(): void {
    this.isEditing = false;
  }

  saveMember(): void {
    this.dataService.saveTeamMember(this.currentMember);
    this.loadTeam();
    this.closeModal();
  }

  deleteMember(id: string): void {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.dataService.deleteTeamMember(id);
      this.loadTeam();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentMember.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
