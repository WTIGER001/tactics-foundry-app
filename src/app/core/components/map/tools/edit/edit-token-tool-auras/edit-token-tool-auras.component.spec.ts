import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenToolAurasComponent } from './edit-token-tool-auras.component';

describe('EditTokenToolAurasComponent', () => {
  let component: EditTokenToolAurasComponent;
  let fixture: ComponentFixture<EditTokenToolAurasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenToolAurasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenToolAurasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
