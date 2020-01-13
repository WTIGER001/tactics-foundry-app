import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollMessageComponent } from './roll-message.component';

describe('RollMessageComponent', () => {
  let component: RollMessageComponent;
  let fixture: ComponentFixture<RollMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
