import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRectangleToolComponent } from './edit-rectangle-tool.component';

describe('EditRectangleToolComponent', () => {
  let component: EditRectangleToolComponent;
  let fixture: ComponentFixture<EditRectangleToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRectangleToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRectangleToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
