import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, RenovationIdea } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-renovation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renovation-detail.component.html',
  styleUrls: ['./renovation-detail.component.css']
})
export class RenovationDetailComponent implements OnInit {
  idea?: RenovationIdea;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idea = this.dataService.getRenovationIdeaById(id);
      }
    });
  }
}
