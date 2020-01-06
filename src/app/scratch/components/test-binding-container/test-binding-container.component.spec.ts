import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBindingContainerComponent } from './test-binding-container.component';

describe('TestBindingContainerComponent', () => {
  let component: TestBindingContainerComponent;
  let fixture: ComponentFixture<TestBindingContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBindingContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBindingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
