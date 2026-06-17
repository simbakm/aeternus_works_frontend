import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInquiriesComponent } from './manage-inquiries.component';

describe('ManageInquiriesComponent', () => {
  let component: ManageInquiriesComponent;
  let fixture: ComponentFixture<ManageInquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
