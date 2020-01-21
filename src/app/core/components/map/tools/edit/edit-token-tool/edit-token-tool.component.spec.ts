import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolComponent } from './edit-token-tool.component';

describe('EditTokenToolComponent', () => {
  let component: EditTokenToolComponent;
  let fixture: ComponentFixture<EditTokenToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
