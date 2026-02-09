import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceModal } from './insurance-modal';

describe('InsuranceModal', () => {
  let component: InsuranceModal;
  let fixture: ComponentFixture<InsuranceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
