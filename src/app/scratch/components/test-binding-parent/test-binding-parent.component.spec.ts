import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBindingParentComponent } from './test-binding-parent.component';

describe('TestBindingParentComponent', () => {
  let component: TestBindingParentComponent;
  let fixture: ComponentFixture<TestBindingParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBindingParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBindingParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
