import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
}
