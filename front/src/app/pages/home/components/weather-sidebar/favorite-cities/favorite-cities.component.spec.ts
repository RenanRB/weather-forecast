import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCitiesComponent } from './favorite-cities.component';

describe('FavoriteCitiesComponent', () => {
  let component: FavoriteCitiesComponent;
  let fixture: ComponentFixture<FavoriteCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteCitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
