import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RenovationsComponent } from './pages/renovations/renovations.component';
import { AboutComponent } from './pages/about/about.component';
import { StructureComponent } from './pages/structure/structure.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';

// Admin Imports
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/admin/login/login.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ManageProjectsComponent } from './pages/admin/manage-projects/manage-projects.component';
import { ManageRenovationsComponent } from './pages/admin/manage-renovations/manage-renovations.component';
import { ManageServicesComponent } from './pages/admin/manage-services/manage-services.component';
import { ManageTeamComponent } from './pages/admin/manage-team/manage-team.component';
import { ManageInquiriesComponent } from './pages/admin/manage-inquiries/manage-inquiries.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:id', component: ProjectDetailComponent },
  { path: 'service/:id', component: ServiceDetailComponent },
  { path: 'renovations', component: RenovationsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'company-structure', component: StructureComponent },
  { path: 'contact', component: ContactComponent },
  
  // Admin Routes
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ManageProjectsComponent },
      { path: 'renovations', component: ManageRenovationsComponent },
      { path: 'services', component: ManageServicesComponent },
      { path: 'team', component: ManageTeamComponent },
      { path: 'inquiries', component: ManageInquiriesComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];


