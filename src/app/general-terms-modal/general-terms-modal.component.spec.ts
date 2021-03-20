import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTermsModalComponent } from './general-terms-modal.component';

describe('GeneralTermsModalComponent', () => {
  let component: GeneralTermsModalComponent;
  let fixture: ComponentFixture<GeneralTermsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTermsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTermsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
