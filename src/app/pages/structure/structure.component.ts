import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, TeamMember } from '../../services/data.service';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.css'
})
export class StructureComponent implements OnInit {
  team: TeamMember[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTeamMembers().subscribe(team => this.team = team);
  }
}
