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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ShearchBarComponent,
    FavoriteCitiesComponent,
    CurrentWeatherComponent,
    SharedModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  weatherData?: WeatherResponse;
  showLastWeek: boolean = false;
  citySearchControl = new FormControl('');
  citySelected!: GeocodeResult;
  isLoading: boolean = false;

  constructor(
    private readonly weatherService: WeatherService, 
    private readonly snackBar: MatSnackBar,
    private readonly weatherIconService: WeatherIconService,
    private readonly selectedCityService: SelectedCityService,
  ) {
  }

  ngOnInit(): void {
    this.selectedCityService.selectedCity$.subscribe((city) => {
      if (city) {
        this.citySelected = city;
        this.loadWeatherData(city);
      }
    });
  }

  get weatherListToShow(): WeatherData[] {
    return this.showLastWeek 
      ? this.weatherData?.historicalWeatherData?.slice(1, -1) ?? [] 
      : this.weatherData?.dailyForecast?.slice(1) ?? [];
  }

  handleCitySelection(city: GeocodeResult): void {
    this.citySelected = city;
    this.selectedCityService.saveCity(city);
    this.loadWeatherData(city);
  }

  loadWeather(latitude: number = -26.4263, longitude: number = -49.1467): void {
    this.isLoading = true;
    this.weatherService.getWeather(latitude, longitude).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.isLoading = false;
        this.snackBar.open('Unable to load weather data. Please try again later.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  loadWeatherData(city: GeocodeResult) {
    this.isLoading = true;
    this.weatherService.getWeather(city.latitude, city.longitude).subscribe({
      next: (data) => {
        this.weatherData = data;
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
