import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  activePopup: number | null = null;

  togglePopup(index: number, event: Event) {
    event.stopPropagation();
    if (this.activePopup === index) {
      this.activePopup = null;
    } else {
      this.activePopup = index;
    }
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.activePopup = null;
  }
}
