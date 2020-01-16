import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrateToolComponent } from './calibrate-tool.component';

describe('CalibrateToolComponent', () => {
  let component: CalibrateToolComponent;
  let fixture: ComponentFixture<CalibrateToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalibrateToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrateToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
