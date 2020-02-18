import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageToolComponent } from './edit-image-tool.component';

describe('EditImageToolComponent', () => {
  let component: EditImageToolComponent;
  let fixture: ComponentFixture<EditImageToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditImageToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
