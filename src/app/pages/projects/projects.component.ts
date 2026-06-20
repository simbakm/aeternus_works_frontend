import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, Project } from '../../services/data.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  categories: string[] = ['All Projects', 'New Construction', 'Renovation', 'Electrical Works'];
  activeCategory: string = 'All Projects';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProjects().subscribe(projects => this.projects = projects);
  }

  get filteredProjects(): Project[] {
    if (this.activeCategory === 'All Projects') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.activeCategory);
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }
}
