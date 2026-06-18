import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Inquiry } from '../../../services/data.service';

@Component({
  selector: 'app-manage-inquiries',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-inquiries.component.html',
  styleUrl: './manage-inquiries.component.css'
})
export class ManageInquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  
  isViewing = false;
  currentInquiryIndex = -1;
  currentInquiry: Inquiry | null = null;
  replyMessage = '';

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadInquiries();
    this.route.queryParamMap.subscribe(params => {
      const focus = params.get('focus');
      if (focus === 'pending') {
        this.openFirstPendingInquiry();
      }
    });
  }

  loadInquiries(): void {
    this.inquiries = this.dataService.getInquiries();
  }

  openFirstPendingInquiry(): void {
    const pendingIndex = this.inquiries.findIndex(inquiry => inquiry.status === 'Pending');
    if (pendingIndex >= 0) {
      this.viewInquiry(pendingIndex);
    }
  }

  viewInquiry(index: number): void {
    this.currentInquiryIndex = index;
    this.currentInquiry = { ...this.inquiries[index] };
    this.isViewing = true;
    this.replyMessage = '';
  }

  closeModal(): void {
    this.isViewing = false;
    this.currentInquiry = null;
    this.currentInquiryIndex = -1;
  }

  sendReply(): void {
    if (this.currentInquiry && this.currentInquiryIndex >= 0) {
      alert(`Reply sent to ${this.currentInquiry.email || this.currentInquiry.phone}:\n\n${this.replyMessage}`);
      
      this.currentInquiry.status = 'Replied';
      this.dataService.updateInquiry(this.currentInquiryIndex, this.currentInquiry);
      
      this.loadInquiries();
      this.closeModal();
    }
  }

  markAsReplied(index: number): void {
    const inquiry = this.inquiries[index];
    inquiry.status = 'Replied';
    this.dataService.updateInquiry(index, inquiry);
    this.loadInquiries();
  }
}
