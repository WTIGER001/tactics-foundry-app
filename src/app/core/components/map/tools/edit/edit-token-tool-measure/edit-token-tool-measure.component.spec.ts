import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolMeasureComponent } from './edit-token-tool-measure.component';

describe('EditTokenToolMeasureComponent', () => {
  let component: EditTokenToolMeasureComponent;
  let fixture: ComponentFixture<EditTokenToolMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
