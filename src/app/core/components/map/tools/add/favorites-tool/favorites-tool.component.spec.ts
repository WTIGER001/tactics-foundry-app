import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesToolComponent } from './favorites-tool.component';

describe('FavoritesToolComponent', () => {
  let component: FavoritesToolComponent;
  let fixture: ComponentFixture<FavoritesToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
