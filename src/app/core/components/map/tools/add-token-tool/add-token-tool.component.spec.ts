import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTokenToolComponent } from './add-token-tool.component';

describe('AddTokenToolComponent', () => {
  let component: AddTokenToolComponent;
  let fixture: ComponentFixture<AddTokenToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTokenToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTokenToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
