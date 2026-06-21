import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Inquiry } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;
  contactForm: FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  formErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      whatsapp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      project: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['project']) {
        this.contactForm.patchValue({ project: params['project'] });
      }
    });
  }

  ngAfterViewInit(): void {
    // Focus the name input when the contact page loads so users can start typing immediately
    setTimeout(() => {
      try {
        this.nameInput?.nativeElement.focus();
      } catch (e) {
        // ignore
      }
    });
  }

  closePopup(): void {
    this.isSubmitted = false;
    this.popupMessage = '';
    this.formErrorMessage = '';
  }

  activePopup: number | null = null;

  togglePopup(index: number, event: Event): void {
    event.stopPropagation();
    if (this.activePopup === index) {
      this.activePopup = null;
    } else {
      this.activePopup = index;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activePopup = null;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.formErrorMessage = '';
      this.isSubmitting = true;
      const formValue = this.contactForm.value;
      const inquiry: Inquiry = {
        ...formValue,
        phone: formValue.whatsapp,
        whatsapp: formValue.whatsapp,
        date: new Date().toISOString(),
        status: 'Pending'
      };

      this.dataService.saveInquiry(inquiry).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.popupType = 'success';
          this.popupMessage = 'Your inquiry has been successfully sent. We will contact you via WhatsApp shortly.';
          this.isSubmitted = true;
          this.contactForm.reset();
        },
        error: () => {
          this.isSubmitting = false;
          this.popupType = 'error';
          this.popupMessage = 'Sorry, we were unable to send your inquiry. Please try again later.';
          this.isSubmitted = true;
        }
      });
    } else {
      this.formErrorMessage = 'Please fill in all required fields before sending your inquiry.';
      this.popupType = 'error';
      this.popupMessage = 'Please fill in all required fields before sending your inquiry.';
      this.isSubmitted = true;
      this.contactForm.markAllAsTouched();
    }
  }
}
