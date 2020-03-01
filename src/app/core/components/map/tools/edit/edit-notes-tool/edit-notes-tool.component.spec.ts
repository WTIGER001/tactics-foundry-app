import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotesToolComponent } from './edit-notes-tool.component';

describe('EditNotesToolComponent', () => {
  let component: EditNotesToolComponent;
  let fixture: ComponentFixture<EditNotesToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNotesToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
