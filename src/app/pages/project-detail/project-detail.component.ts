import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Project } from '../../services/data.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  activeImageIndex = 0;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isLoading = true;
        this.project = undefined;
        this.dataService.getProjectById(id).subscribe({
          next: project => {
            this.project = project;
            this.activeImageIndex = 0;
            this.isLoading = false;
          },
          error: () => {
            this.project = undefined;
            this.isLoading = false;
          }
        });
      }
    });
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  getImageAt(index: number): string {
    if (!this.project) return 'assets/placeholder.png';
    const imgs: any = (this.project as any).images || [];
    const img = imgs[index];
    if (!img) return 'assets/placeholder.png';
    if (typeof img === 'string') return img;
    if (img.imageUrl) return img.imageUrl;
    if (img.url) return img.url;
    return 'assets/placeholder.png';
  }

  getImageObject(img: any): string {
    if (!img) return 'assets/placeholder.png';
    if (typeof img === 'string') return img;
    if (img.imageUrl) return img.imageUrl;
    if (img.url) return img.url;
    return 'assets/placeholder.png';
  }
}
