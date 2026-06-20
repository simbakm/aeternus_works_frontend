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

  getImage(project: Project): string {
    if (!project) return 'assets/placeholder.png';
    // project.images is an array of ProjectImage objects with imageUrl
    if (project.images && project.images.length) {
      const first = project.images[0];
      if (first && (first as any).imageUrl) return (first as any).imageUrl;
    }
    // fallback to common single-property names
    if ((project as any).imageUrl) return (project as any).imageUrl;
    if ((project as any).image) return (project as any).image;
    return 'assets/placeholder.png';
  }
}
