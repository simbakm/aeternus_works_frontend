import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../services/data.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(private router: Router) {}

  navigateToProject(): void {
    this.router.navigate(['/project', this.project.id]);
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToProject();
    }
  }
}
