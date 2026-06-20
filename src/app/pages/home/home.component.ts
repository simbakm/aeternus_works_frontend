import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Project, RenovationIdea, ServiceInfo } from '../../services/data.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProjectCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  featuredProjects: Project[] = [];
  featuredRenovationIdea?: RenovationIdea;
  services: ServiceInfo[] = [];
  completedCount = 0;
  ongoingCount = 0;
  iconOptions = [
    { value: 'building', label: 'Building', preview: '🏗️' },
    { value: 'renovation', label: 'Renovation', preview: '🔨' },
    { value: 'civil', label: 'Civil Works', preview: '🛣️' },
    { value: 'project-management', label: 'Project Mgmt', preview: '📋' },
    { value: 'masonry', label: 'Masonry', preview: '🧱' },
    { value: 'plumbing', label: 'Plumbing', preview: '🔧' },
    { value: 'generic', label: 'Generic', preview: '🛠️' }
  ];

  private completedTarget = 0;
  private ongoingTarget = 0;
  private statsAnimated = false;

  @ViewChild('statsSection') statsSection!: ElementRef;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.dataService.getFeaturedProjects().subscribe(projects => this.featuredProjects = projects);
    this.dataService.getProjects().subscribe(all => {
      this.completedTarget = all.filter(p => p.status === 'Completed').length;
      this.ongoingTarget   = all.filter(p => p.status === 'Ongoing').length;
    });
    this.dataService.getServices().subscribe(services => this.services = services);
    this.dataService.getRenovationIdeas().subscribe(ideas => {
      this.featuredRenovationIdea = ideas.length ? ideas[0] : undefined;
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounter('completed', this.completedTarget);
            this.animateCounter('ongoing',   this.ongoingTarget);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (this.statsSection) {
      observer.observe(this.statsSection.nativeElement);
    }
  }

  getIconPreview(icon?: string): string {
    if (!icon) {
      return '🛠️';
    }
    const normalized = icon.startsWith('icon-') ? icon.replace('icon-', '') : icon;
    const entry = this.iconOptions.find(option => option.value === icon || option.value === normalized);
    return entry ? entry.preview : '🛠️';
  }

  private animateCounter(type: 'completed' | 'ongoing', target: number): void {
    const duration = 1200;
    const steps    = 50;
    const stepTime = duration / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (type === 'completed') {
        this.completedCount = current;
      } else {
        this.ongoingCount = current;
      }
    }, stepTime);
  }
}
