import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRenovationsComponent } from './manage-renovations.component';

describe('ManageRenovationsComponent', () => {
  let component: ManageRenovationsComponent;
  let fixture: ComponentFixture<ManageRenovationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRenovationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRenovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
