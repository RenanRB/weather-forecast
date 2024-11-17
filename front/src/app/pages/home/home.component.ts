import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { SharedModule } from '../../shared/shared.module';
import { WeatherService } from '../../services/weather.service';
import { WeatherData, WeatherResponse } from '../../core/interfaces/weather.interface';
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
  private readonly STORED_CITY_KEY = 'lastSelectedCity';

  constructor(
    private readonly weatherService: WeatherService, 
    private readonly geocodeService: GeocodeService,
    private readonly snackBar: MatSnackBar
  ) {
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
    const storedCity = this.getStoredCity();
    if (storedCity) {
      this.citySelected = storedCity;
      this.citySearchControl.setValue(storedCity.name);
      this.loadWeather(storedCity.latitude, storedCity.longitude);
    } else {
      this.loadWeather();
    }
  }

  private getStoredCity(): GeocodeResult | null {
    const storedCity = localStorage.getItem(this.STORED_CITY_KEY);
    return storedCity ? JSON.parse(storedCity) : null;
  }

  private saveCity(city: GeocodeResult): void {
    localStorage.setItem(this.STORED_CITY_KEY, JSON.stringify(city));
  }

  get weatherListToShow(): WeatherData[] {
    return this.showLastWeek ? this.weatherData?.historicalWeatherData.slice(1, -1) ?? [] : this.weatherData?.dailyForecast.slice(1) ?? [];
  }

  loadWeather(latitude: number = -26.4263, longitude: number = -49.1467): void {
    this.weatherService.getWeather(latitude, longitude).subscribe((data) => this.weatherData = data);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.weatherService.getWeather(latitude, longitude)
            .subscribe((data) => this.weatherData = data);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location. Using default location.';
          
          switch(error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location services.';
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Check your device settings.';
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          
          console.error('Geolocation error:', error);
          this.loadWeather();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      this.snackBar.open('Geolocation is not supported by this browser', 'Close', {
        duration: 5000
      });
      this.loadWeather();
    }
  }

  onCitySelected(event: any) {
    const city = event.option.value;
    this.citySelected = city;
    this.saveCity(city);
    this.loadWeatherData(city);
  }

  loadWeatherData(city: GeocodeResult) {
    this.weatherService.getWeather(city.latitude, city.longitude).subscribe((data) => this.weatherData = data);
  }

  displayFn = (city: any): string => {
    return city ? city.name : '';
  }

}
