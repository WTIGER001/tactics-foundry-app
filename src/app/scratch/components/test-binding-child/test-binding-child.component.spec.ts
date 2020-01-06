import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBindingChildComponent } from './test-binding-child.component';

describe('TestBindingChildComponent', () => {
  let component: TestBindingChildComponent;
  let fixture: ComponentFixture<TestBindingChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBindingChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBindingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
