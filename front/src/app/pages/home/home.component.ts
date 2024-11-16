import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WeatherService } from '../../services/weather.service';
import { WeatherData, WeatherResponse } from '../../core/interfaces/weather.interface';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { GeocodeService } from '../../services/geocode.service';
import { GeocodeResult } from '../../core/interfaces/geocode.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  weatherData?: WeatherResponse;
  showLastWeek: boolean = false;
  citySearchControl = new FormControl('');
  citySelected: GeocodeResult | null = null;
  filteredCities: Observable<GeocodeResult[]>;

  constructor(private readonly weatherService: WeatherService, private readonly geocodeService: GeocodeService) {
    this.filteredCities = this.citySearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value: string | GeocodeResult | null) => {
        const searchTerm = typeof value === 'string' ? value : value?.name ?? '';
        return this.geocodeService.searchCities(searchTerm);
      })
    );
  }

  ngOnInit(): void {
    this.loadWeather();
  }
  get weatherListToShow(): WeatherData[] {
    return this.showLastWeek ? this.weatherData?.historicalWeatherData.slice(1, -1) ?? [] : this.weatherData?.dailyForecast.slice(1) ?? [];
  }

  loadWeather(): void {
    this.weatherService.getWeather(-26.4263, -49.1467).subscribe((data) => this.weatherData = data);
  }

  onCitySelected(event: any) {
    const city = event.option.value;
    this.loadWeatherData(city);
  }

  loadWeatherData(city: GeocodeResult) {
    this.weatherService.getWeather(city.latitude, city.longitude).subscribe((data) => this.weatherData = data);
  }

  displayFn = (city: any): string => {
    return city ? city.name : '';
  }

}
