import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { WeatherService } from '../../services/weather.service';
import { WeatherData, WeatherResponse } from '../../core/interfaces/weather.interface';
import { GeocodeResult } from '../../core/interfaces/geocode.interface';
import { ShearchBarComponent } from './components/weather-sidebar/shearch-bar/shearch-bar.component';
import { FavoriteCitiesComponent } from './components/weather-sidebar/favorite-cities/favorite-cities.component';
import { WeatherIconService } from '../../services/weather-icon.service';
import { CurrentWeatherComponent } from './components/weather-sidebar/current-weather/current-weather.component';
import { SelectedCityService } from './services/selected-city.service';
import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import { WeatherHighlightsComponent } from './components/weather-highlights/weather-highlights.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ShearchBarComponent,
    FavoriteCitiesComponent,
    CurrentWeatherComponent,
    WeatherForecastComponent,
    WeatherHighlightsComponent,
    SharedModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  weatherResponse?: WeatherResponse;
  showLastWeek: boolean = false;
  citySearchControl = new FormControl('');
  citySelected!: GeocodeResult;
  isLoading: boolean = false;

  get weatherListToShow(): WeatherData[] {
    return this.showLastWeek 
      ? this.weatherResponse?.historicalWeatherData?.slice(1, -1) ?? [] 
      : this.weatherResponse?.dailyForecast?.slice(1) ?? [];
  }

  constructor(
    private readonly weatherService: WeatherService, 
    private readonly snackBar: MatSnackBar,
    private readonly weatherIconService: WeatherIconService,
    private readonly selectedCityService: SelectedCityService,
  ) {
  }

  ngOnInit(): void {
    this.selectedCityService.selectedCity$.subscribe((city) => {
      if (!city) {
        city = {
          latitude: 40.71427,
          longitude: -74.00597,
          elevation: '10m',
          name: 'New York',
          admin: 'New York',
          country: 'United States',
          countryCode: 'US',
          timezone: 'America/New_York'
        };
      }

      this.citySelected = city;
      this.loadWeatherData(city);
    });
  }

  handleCitySelection(city: GeocodeResult): void {
    this.citySelected = city;
    this.selectedCityService.saveCity(city);
    this.loadWeatherData(city);
  }

  loadWeatherData(city: GeocodeResult): void {
    this.isLoading = true;
    this.weatherService.getWeather(city.latitude, city.longitude).subscribe({
      next: (data) => {
        this.weatherResponse = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.isLoading = false;
        this.snackBar.open(`Failed to load weather data for ${city.name}. Please try again later.`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  getWeatherIcon(isDay: boolean, code: number = 0): string {
    return this.weatherIconService.getWeatherIcon(isDay, code);
  }

}
