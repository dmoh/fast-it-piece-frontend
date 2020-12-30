import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCliComponent } from './doc-cli.component';

describe('DocCliComponent', () => {
  let component: DocCliComponent;
  let fixture: ComponentFixture<DocCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
