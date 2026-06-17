import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, RenovationIdea } from '../../services/data.service';

@Component({
  selector: 'app-renovations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './renovations.component.html',
  styleUrl: './renovations.component.css'
})
export class RenovationsComponent implements OnInit {
  ideas: RenovationIdea[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.ideas = this.dataService.getRenovationIdeas();
  }
}
