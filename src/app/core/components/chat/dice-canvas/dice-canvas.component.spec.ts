import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceCanvasComponent } from './dice-canvas.component';

describe('DiceCanvasComponent', () => {
  let component: DiceCanvasComponent;
  let fixture: ComponentFixture<DiceCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiceCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
