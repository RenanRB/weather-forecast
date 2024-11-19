import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherHighlightsComponent } from './weather-highlights.component';

describe('WeatherHighlightsComponent', () => {
  let component: WeatherHighlightsComponent;
  let fixture: ComponentFixture<WeatherHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherHighlightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
