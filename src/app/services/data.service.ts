import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProjectImage {
  id?: string;
  imageUrl: string;
  sortOrder?: number;
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  location: string;
  description: string;
  images: ProjectImage[];
  status: string; // 'Completed' | 'Ongoing' | 'Upcoming'
  date: string;
}

export interface RenovationTip {
  id?: string;
  tipText: string;
  sortOrder?: number;
}

export interface RenovationIdea {
  id?: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  tips: RenovationTip[];
  advice?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface Inquiry {
  id?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  project?: string;
  message: string;
  date?: string;
  status?: string;
}

export interface ServiceProcessStep {
  id?: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface ServiceFaq {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface ServiceInfo {
  id?: string;
  title: string;
  icon?: string;
  description: string;
  benefits: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://aeternus-works-back-end.onrender.com/api';

  constructor(private http: HttpClient) {}

  // --- SERVICES ---
  getServices(): Observable<ServiceInfo[]> {
    return this.http.get<ServiceInfo[]>(`${this.apiUrl}/services`);
  }

  getServiceById(id: string): Observable<ServiceInfo> {
    return this.http.get<ServiceInfo>(`${this.apiUrl}/services/${id}`);
  }

  saveService(service: ServiceInfo): Observable<ServiceInfo> {
    if (service.id && service.id !== '') {
      // For services, the ID is often a slug. 
      // If the backend has it, PUT might work, but for now we'll just POST to create/update.
      return this.http.post<ServiceInfo>(`${this.apiUrl}/services`, service);
    }
    return this.http.post<ServiceInfo>(`${this.apiUrl}/services`, service);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }

  // --- PROJECTS ---
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.getProjects().pipe(
      map(projects => projects.slice(0, 3))
    );
  }

  saveProject(project: Project): Observable<Project> {
    if (project.id) {
      return this.http.put<Project>(`${this.apiUrl}/projects/${project.id}`, project);
    }
    return this.http.post<Project>(`${this.apiUrl}/projects`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }

  // --- RENOVATION IDEAS ---
  getRenovationIdeas(): Observable<RenovationIdea[]> {
    return this.http.get<RenovationIdea[]>(`${this.apiUrl}/renovations`);
  }

  getRenovationIdeaById(id: string): Observable<RenovationIdea> {
    return this.http.get<RenovationIdea>(`${this.apiUrl}/renovations/${id}`);
  }

  saveRenovationIdea(idea: RenovationIdea): Observable<RenovationIdea> {
    if (idea.id) {
      return this.http.post<RenovationIdea>(`${this.apiUrl}/renovations`, idea); // Or PUT if backed supports it
    }
    return this.http.post<RenovationIdea>(`${this.apiUrl}/renovations`, idea);
  }

  deleteRenovationIdea(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/renovations/${id}`);
  }

  // --- TEAM ---
  getTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/team`);
  }

  saveTeamMember(member: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/team`, member);
  }

  deleteTeamMember(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/team/${id}`);
  }

  // --- INQUIRIES ---
  saveInquiry(inquiry: Inquiry): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${this.apiUrl}/inquiries`, inquiry);
  }

  getInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(`${this.apiUrl}/inquiries`);
  }

  getPendingInquiryCount(): Observable<number> {
    return this.getInquiries().pipe(
      map(inquiries => inquiries.filter(i => i.status === 'Pending').length)
    );
  }

  sendReply(id: string, message: string, email?: string, phone?: string, whatsapp?: string): Observable<string> {
    // Backend returns plain text (e.g. "Reply sent"). Tell HttpClient to treat the response as text
    // to avoid JSON parse errors when a 200 OK contains non-JSON body.
    return this.http.post(
      `${this.apiUrl}/inquiries/${id}/reply`,
      { message, email, phone, whatsapp },
      { responseType: 'text' as any }
    ) as unknown as Observable<string>;
  }

  // --- Mock Analytics Data ---
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
