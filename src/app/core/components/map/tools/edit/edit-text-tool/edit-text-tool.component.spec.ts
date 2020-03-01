import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTextToolComponent } from './edit-text-tool.component';

describe('EditTextToolComponent', () => {
  let component: EditTextToolComponent;
  let fixture: ComponentFixture<EditTextToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTextToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTextToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
