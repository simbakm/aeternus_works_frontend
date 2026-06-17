import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  images: string[];
  status: 'Completed' | 'Ongoing' | 'Upcoming';
  date: string;
}

export interface RenovationIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
}

export interface Inquiry {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  project: string;
  message: string;
  date: string;
  status: string;
}

export interface ServiceInfo {
  id: string;
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private services: ServiceInfo[] = [
    {
      id: 'building-construction',
      title: 'Building Construction',
      icon: 'icon-building',
      description: 'Residential, Commercial, and Industrial building construction with high-quality materials and unparalleled craftsmanship.',
      benefits: ['Structural Integrity Guarantee', 'Customized Architectural Solutions', 'Timely Project Completion'],
      process: [
        { title: 'Consultation', description: 'Initial meeting to understand your vision and requirements.' },
        { title: 'Design & Planning', description: 'Creating blueprints and securing necessary permits.' },
        { title: 'Construction', description: 'The actual building phase with regular updates.' },
        { title: 'Handover & Maintenance', description: 'Final inspection, handover, and ongoing support.' }
      ],
      faqs: [
        { question: 'Do you handle the permits?', answer: 'Yes, we handle all necessary city and state permits.' },
        { question: 'What is the warranty period?', answer: 'We offer a 10-year structural warranty on all new builds.' }
      ],
      image: 'https://images.unsplash.com/photo-1541888086925-0c77030e5e58?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'renovations',
      title: 'Renovations & Refurbishment',
      icon: 'icon-renovation',
      description: 'Transforming existing spaces into modern, functional, and aesthetically pleasing areas that suit your current lifestyle.',
      benefits: ['Increased Property Value', 'Modernized Aesthetics', 'Improved Energy Efficiency'],
      process: [
        { title: 'Assessment', description: 'Evaluating the current structure and renovation potential.' },
        { title: 'Design', description: 'Creating a modern design that integrates with existing architecture.' },
        { title: 'Demolition & Rebuild', description: 'Safe removal of old structures and building the new.' },
        { title: 'Finishing Touches', description: 'Painting, fixtures, and final clean-up.' }
      ],
      faqs: [
        { question: 'Can we live in the house during renovation?', answer: 'Depending on the scale, yes, though some areas may be restricted.' },
        { question: 'Do you use eco-friendly materials?', answer: 'We prioritize sustainable and eco-friendly materials whenever possible.' }
      ],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'civil-works',
      title: 'Civil Works & Infrastructure',
      icon: 'icon-civil',
      description: 'Expertise in infrastructure projects, roads, drainage systems, and large-scale civil engineering works.',
      benefits: ['Durable Infrastructure', 'Public Safety Compliance', 'Efficient Resource Management'],
      process: [
        { title: 'Site Surveying', description: 'Comprehensive analysis of the topography and soil.' },
        { title: 'Engineering Design', description: 'Detailed engineering plans for civil structures.' },
        { title: 'Execution', description: 'Heavy machinery and expert crews execute the build.' },
        { title: 'Quality Assurance', description: 'Rigorous testing to ensure long-term durability.' }
      ],
      faqs: [
        { question: 'Are you PRAZ registered?', answer: 'Yes, we are a fully registered PRAZ contractor.' },
        { question: 'Do you handle government contracts?', answer: 'Yes, we have extensive experience with government infrastructure projects.' }
      ],
      image: 'https://images.unsplash.com/photo-1584464457692-71be18d361dd?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'project-management',
      title: 'Design-build & Project Mgmt',
      icon: 'icon-design',
      description: 'End-to-end project management ensuring timely delivery, cost-effectiveness, and seamless communication.',
      benefits: ['Single Point of Contact', 'Cost Control', 'Accelerated Schedule'],
      process: [
        { title: 'Project Scoping', description: 'Defining the project timeline, budget, and deliverables.' },
        { title: 'Resource Allocation', description: 'Assigning the right team and procuring materials.' },
        { title: 'Monitoring & Control', description: 'Daily tracking of progress against the master schedule.' },
        { title: 'Project Closure', description: 'Final reporting and successful handover.' }
      ],
      faqs: [
        { question: 'How do you keep us updated?', answer: 'We provide weekly progress reports and host regular site meetings.' },
        { question: 'What happens if there are delays?', answer: 'Our proactive management usually prevents delays, but if unavoidable, we communicate immediately and adjust schedules to minimize impact.' }
      ],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
    }
  ];

  private projects: Project[] = [
    {
      id: 'p1',
      title: 'Greenhouse Construction',
      category: 'New Construction',
      location: 'Borrowdale, Harare',
      description: 'A modern greenhouse facility built for sustainable agriculture. The structure features automated climate control, advanced irrigation systems, and a durable steel frame designed to withstand harsh weather conditions. It provides a perfect environment for year-round crop production.',
      images: ['/greenhouse.png', 'https://images.unsplash.com/photo-1585320806297-9794b3e4ce11?q=80&w=800&auto=format&fit=crop'],
      status: 'Completed',
      date: 'Nov 2025'
    },
    {
      id: 'p2',
      title: 'Modern Kitchen Renovation',
      category: 'Renovation',
      location: 'Mt Pleasant, Harare',
      description: 'Complete overhaul of a 90s kitchen into a modern culinary space. Features custom cabinetry, quartz countertops, state-of-the-art built-in appliances, and a massive central island perfect for family gatherings.',
      images: ['/modernKitchen.png','https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'],
      status: 'Completed',
      date: 'Sep 2025'
    },
    {
      id: 'p3',
      title: 'Outdoor Light Fixtures',
      category: 'Electrical Works',
      location: 'Avondale, Harare',
      description: 'Installation of high-efficiency LED outdoor lighting for a commercial property. Enhances security and highlights the architectural features of the building during the night.',
      images: ['/outerdoor.png'],
      status: 'Completed',
      date: 'Aug 2025'
    },
    {
      id: 'p4',
      title: 'Family Pool Construction',
      category: 'New Construction',
      location: 'Highlands, Harare',
      description: 'Design and construction of a luxurious residential family pool. Includes custom tile work, a built-in spa, underwater lighting, and surrounding anti-slip paving.',
      images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop'],
      status: 'Ongoing',
      date: 'Oct 2025'
    }
  ];

  private renovationIdeas: RenovationIdea[] = [
    {
      id: 'r1',
      category: 'Kitchen',
      title: 'Open Concept Kitchen',
      description: 'Remove walls to create an airy open space perfect for entertaining.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'r2',
      category: 'Bathroom',
      title: 'Spa-Like Retreat',
      description: 'Upgrade your bathroom with a freestanding tub and walk-in shower.',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'r3',
      category: 'Exterior',
      title: 'Modern Facade',
      description: 'Update the exterior of your home with modern materials and large windows.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
    }
  ];

  private team: TeamMember[] = [
    {
      id: 't1',
      name: 'Tanaka Mutsikwi',
      role: 'CEO / Director',
      description: 'Over 5 years of experience in the construction industry.',
      image: '/CEO.png'
    },
    {
      id: 't2',
      name: 'Leticia Kamupenyi',
      role: 'Project Manager',
      description: 'Expert in managing large scale commercial projects.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 't3',
      name: 'David Moyo',
      role: 'Lead Engineer',
      description: 'Specializes in structural engineering and sustainable design.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedProjects = localStorage.getItem('aeternus_projects');
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
        
        // Restore p2 and p3 if they are missing
        let modified = false;
        if (!this.projects.some(p => p.id === 'p2')) {
          this.projects.push({
            id: 'p2',
            title: 'Modern Kitchen Renovation',
            category: 'Renovation',
            location: 'Mt Pleasant, Harare',
            description: 'Complete overhaul of a 90s kitchen into a modern culinary space. Features custom cabinetry, quartz countertops, state-of-the-art built-in appliances, and a massive central island perfect for family gatherings.',
            images: ['/modernKitchen.png', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'],
            status: 'Completed',
            date: 'Sep 2025'
          });
          modified = true;
        }
        if (!this.projects.some(p => p.id === 'p3')) {
          this.projects.push({
            id: 'p3',
            title: 'Outdoor Light Fixtures',
            category: 'Electrical Works',
            location: 'Avondale, Harare',
            description: 'Installation of high-efficiency LED outdoor lighting for a commercial property. Enhances security and highlights the architectural features of the building during the night.',
            images: ['/outerdoor.png'],
            status: 'Completed',
            date: 'Aug 2025'
          });
          modified = true;
        }
        if (modified) {
          localStorage.setItem('aeternus_projects', JSON.stringify(this.projects));
        }
      }

      const storedServices = localStorage.getItem('aeternus_services');
      if (storedServices) this.services = JSON.parse(storedServices);

      const storedIdeas = localStorage.getItem('aeternus_renovationIdeas');
      if (storedIdeas) this.renovationIdeas = JSON.parse(storedIdeas);

      const storedTeam = localStorage.getItem('aeternus_team');
      if (storedTeam) this.team = JSON.parse(storedTeam);
    }
  }

  getServices(): ServiceInfo[] {
    return this.services;
  }

  getServiceById(id: string): ServiceInfo | undefined {
    return this.services.find(s => s.id === id);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getProjects(): Project[] {
    return this.projects;
  }

  getFeaturedProjects(): Project[] {
    return this.projects.slice(0, 3);
  }

  getRenovationIdeas(): RenovationIdea[] {
    return this.renovationIdeas;
  }

  getTeamMembers(): TeamMember[] {
    return this.team;
  }

  saveInquiry(inquiry: Inquiry): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const inquiriesStr = localStorage.getItem('aeternus_inquiries');
    let inquiries: Inquiry[] = [];
    if (inquiriesStr) {
      try {
        inquiries = JSON.parse(inquiriesStr);
      } catch (e) {
        console.error('Error parsing inquiries');
      }
    }
    inquiries.push(inquiry);
    localStorage.setItem('aeternus_inquiries', JSON.stringify(inquiries));
    console.log('Inquiry saved to local storage:', inquiry);
  }

  getInquiries(): Inquiry[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const str = localStorage.getItem('aeternus_inquiries');
    return str ? JSON.parse(str) : [];
  }

  updateInquiry(index: number, inquiry: Inquiry): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const inquiries = this.getInquiries();
    inquiries[index] = inquiry;
    localStorage.setItem('aeternus_inquiries', JSON.stringify(inquiries));
  }

  // Projects CRUD
  saveProject(project: Project): void {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index >= 0) this.projects[index] = project;
    else this.projects.push(project);
    this.persist('aeternus_projects', this.projects);
  }

  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.persist('aeternus_projects', this.projects);
  }

  // Services CRUD
  saveService(service: ServiceInfo): void {
    const index = this.services.findIndex(s => s.id === service.id);
    if (index >= 0) this.services[index] = service;
    else this.services.push(service);
    this.persist('aeternus_services', this.services);
  }

  deleteService(id: string): void {
    this.services = this.services.filter(s => s.id !== id);
    this.persist('aeternus_services', this.services);
  }

  // Renovation Ideas CRUD
  saveRenovationIdea(idea: RenovationIdea): void {
    const index = this.renovationIdeas.findIndex(r => r.id === idea.id);
    if (index >= 0) this.renovationIdeas[index] = idea;
    else this.renovationIdeas.push(idea);
    this.persist('aeternus_renovationIdeas', this.renovationIdeas);
  }

  deleteRenovationIdea(id: string): void {
    this.renovationIdeas = this.renovationIdeas.filter(r => r.id !== id);
    this.persist('aeternus_renovationIdeas', this.renovationIdeas);
  }

  // Team CRUD
  saveTeamMember(member: TeamMember): void {
    const index = this.team.findIndex(t => t.id === member.id);
    if (index >= 0) this.team[index] = member;
    else this.team.push(member);
    this.persist('aeternus_team', this.team);
  }

  deleteTeamMember(id: string): void {
    this.team = this.team.filter(t => t.id !== id);
    this.persist('aeternus_team', this.team);
  }

  private persist(key: string, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // Mock Analytics Data
  getSiteTrafficData() {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Views',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: 'rgba(56, 189, 248, 1)',
        fill: true
      }]
    };
  }

  getInquiriesAnalyticsData() {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [12, 19, 3, 5, 2, 3, 9],
        label: 'Inquiries',
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }]
    };
  }
}
