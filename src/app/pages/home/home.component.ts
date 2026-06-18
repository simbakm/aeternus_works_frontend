import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Project, RenovationIdea } from '../../services/data.service';
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
  completedCount = 0;
  ongoingCount = 0;

  private completedTarget = 0;
  private ongoingTarget = 0;
  private statsAnimated = false;

  @ViewChild('statsSection') statsSection!: ElementRef;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.featuredProjects = this.dataService.getFeaturedProjects();
    const all = this.dataService.getProjects();
    this.completedTarget = all.filter(p => p.status === 'Completed').length;
    this.ongoingTarget   = all.filter(p => p.status === 'Ongoing').length;
    const ideas = this.dataService.getRenovationIdeas();
    this.featuredRenovationIdea = ideas.length ? ideas[0] : undefined;
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
