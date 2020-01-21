import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolPersonalComponent } from './edit-token-tool-personal.component';

describe('EditTokenToolPersonalComponent', () => {
  let component: EditTokenToolPersonalComponent;
  let fixture: ComponentFixture<EditTokenToolPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
