import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService, Inquiry } from '../../../services/data.service';

@Component({
  selector: 'app-manage-inquiries',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-inquiries.component.html',
  styleUrl: './manage-inquiries.component.css'
})
export class ManageInquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  isLoading = false;
  isSendingReply = false;
  isViewing = false;
  currentInquiry: Inquiry | null = null;
  replyMessage = '';
  replySuccess = '';
  replyError = '';
  replyWhatsappLink = '';
  replySent = false;
  showReplyForm = false;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadInquiries();
    this.route.queryParamMap.subscribe(params => {
      if (params.get('focus') === 'pending') {
        this.openFirstPendingInquiry();
      }
    });
  }

  loadInquiries(): void {
    this.isLoading = true;
    this.dataService.getInquiries().subscribe({
      next: inquiries => {
        this.inquiries = inquiries.sort((a, b) => {
          const aPending = a.status?.toLowerCase() === 'pending';
          const bPending = b.status?.toLowerCase() === 'pending';
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openFirstPendingInquiry(): void {
    const pending = this.inquiries.find(i => i.status === 'Pending');
    if (pending) {
      this.viewInquiry(pending);
    }
  }

  viewInquiry(inquiry: Inquiry): void {
    this.currentInquiry = { ...inquiry };
    this.isViewing = true;
    this.replyMessage = this.buildReplyTemplate(inquiry.name);
    this.replySuccess = '';
    this.replyError = '';
    this.replyWhatsappLink = '';
    this.replySent = false;

    if (this.isPending(inquiry.status)) {
      this.showReplyForm = true;
      this.replyMessage = this.buildReplyTemplate(inquiry.name);
      // Let the DOM update, then auto-resize and focus the textarea so the user can start editing immediately.
      setTimeout(() => {
        this.autoResize();
        try {
          const el = this.replyTextarea?.nativeElement;
          if (el) {
            el.focus();
            // place cursor at first editable line (first non-empty line after greeting)
            const val = el.value || '';
            let pos = 0;
            const firstNewline = val.indexOf('\n');
            if (firstNewline >= 0) {
              pos = firstNewline + 1;
              while (pos < val.length && (val[pos] === '\n' || val[pos] === '\r')) {
                pos++;
              }
            }
            if (pos > val.length) pos = val.length;
            el.setSelectionRange(pos, pos);
          }
        } catch (e) {
          // ignore focus errors
        }
      });
    } else {
      this.showReplyForm = false;
      this.replyMessage = '';
    }
  }

  openReplyForm(): void {
    this.showReplyForm = true;
    this.replyMessage = '';
    setTimeout(() => {
      this.autoResize();
      try {
        const el = this.replyTextarea?.nativeElement;
        if (el) {
          el.focus();
        }
      } catch (e) {}
    });
  }

  buildReplyTemplate(name?: string): string {
    const contactName = name?.trim() || 'Customer';
    return `Dear ${contactName},\n\nThank you for contacting Aeternus Works Construction. We appreciate your inquiry and the opportunity to support your project. We will review your request and follow up with a proposal and next steps shortly.\n\nIf you have any additional details to share, please reply to this email or message.\n\nKind regards,\nAeternus Works Construction`;
  }

  closeModal(): void {
    this.isViewing = false;
    this.currentInquiry = null;
  }

  sendReply(replyForm: any): void {
    const trimmedMessage = this.replyMessage.trim();
    if (!this.currentInquiry?.id || !trimmedMessage) return;

    this.replyError = '';
    this.replySuccess = '';
    this.replyWhatsappLink = '';
    this.replySent = false;
    this.isSendingReply = true;

    console.log('[ManageInquiries] sendReply start', {
      id: this.currentInquiry.id,
      email: this.currentInquiry.email,
      phone: this.currentInquiry.phone,
      whatsapp: this.currentInquiry.whatsapp,
      message: trimmedMessage
    });

    this.dataService.sendReply(
      this.currentInquiry.id,
      trimmedMessage,
      this.currentInquiry.email,
      this.currentInquiry.phone,
      this.currentInquiry.whatsapp
    ).subscribe({
      next: (res) => {
        console.log('[ManageInquiries] sendReply success', { res });
        this.isSendingReply = false;
        this.replySuccess = 'Email reply sent successfully. You can also send the same reply on WhatsApp.';
        this.replyError = '';
        this.replySent = true;
        this.replyWhatsappLink = this.buildWhatsAppUrl(this.currentInquiry!, trimmedMessage);
        this.loadInquiries();
        console.log('[ManageInquiries] state after success', {
          replySuccess: this.replySuccess,
          replyError: this.replyError,
          replySent: this.replySent,
          replyWhatsappLink: this.replyWhatsappLink
        });
      },
      error: (err) => {
        console.error('[ManageInquiries] sendReply error', err);
        this.isSendingReply = false;
        this.replySuccess = '';
        this.replyError = 'Failed to send email. You can still open WhatsApp and send the reply manually.';
        this.replySent = true;
        this.replyWhatsappLink = this.buildWhatsAppUrl(this.currentInquiry!, trimmedMessage);
        console.log('[ManageInquiries] state after error', {
          replySuccess: this.replySuccess,
          replyError: this.replyError,
          replySent: this.replySent,
          replyWhatsappLink: this.replyWhatsappLink
        });
      }
    });
  }

  buildWhatsAppUrl(inquiry: Inquiry, message: string): string {
    const rawPhone = inquiry.whatsapp?.trim() || inquiry.phone?.trim() || '';
    const numericPhone = rawPhone.replace(/\D/g, '');
    if (!numericPhone) {
      return 'https://web.whatsapp.com/';
    }
    return `https://wa.me/${numericPhone}?text=${encodeURIComponent(message)}`;
  }

  @ViewChild('replyTextarea') replyTextarea?: ElementRef<HTMLTextAreaElement>;

  autoResize(event?: Event): void {
    const el: HTMLTextAreaElement | undefined = event ? (event.target as HTMLTextAreaElement) : this.replyTextarea?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  formatStatus(status: string | undefined): string {
    if (!status) return 'Unknown';
    if (status.toLowerCase() === 'pending') return 'Pending';
    if (status.toLowerCase() === 'replied_email') return 'Replied';
    if (status.toLowerCase() === 'replied_whatsapp') return 'Replied';
    if (status.toLowerCase() === 'replied') return 'Replied';
    
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }

  isPending(status: string | undefined): boolean {
    return status?.toLowerCase() === 'pending';
  }
}
