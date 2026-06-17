import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService, Inquiry } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitted = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      email: [''],
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

  onSubmit() {
    if (this.contactForm.valid) {
      const inquiry: Inquiry = {
        ...this.contactForm.value,
        date: new Date().toISOString(),
        status: 'Pending'
      };
      
      this.dataService.saveInquiry(inquiry);
      
      this.isSubmitted = true;
      this.successMessage = 'Your inquiry has been successfully sent. We will contact you via WhatsApp shortly.';
      this.contactForm.reset();
      
      setTimeout(() => {
        this.isSubmitted = false;
      }, 5000);
    }
  }
}
