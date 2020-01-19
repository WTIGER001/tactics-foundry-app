import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCircleToolComponent } from './edit-circle-tool.component';

describe('EditCircleToolComponent', () => {
  let component: EditCircleToolComponent;
  let fixture: ComponentFixture<EditCircleToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCircleToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCircleToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
