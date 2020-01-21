import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolImageComponent } from './edit-token-tool-image.component';

describe('EditTokenToolImageComponent', () => {
  let component: EditTokenToolImageComponent;
  let fixture: ComponentFixture<EditTokenToolImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
