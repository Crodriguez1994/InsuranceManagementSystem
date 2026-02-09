import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInsurances } from './client-insurances';

describe('ClientInsurances', () => {
  let component: ClientInsurances;
  let fixture: ComponentFixture<ClientInsurances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInsurances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientInsurances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
