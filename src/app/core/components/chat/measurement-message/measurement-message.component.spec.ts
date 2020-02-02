import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementMessageComponent } from './measurement-message.component';

describe('MeasurementMessageComponent', () => {
  let component: MeasurementMessageComponent;
  let fixture: ComponentFixture<MeasurementMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
