import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { SharedModule } from '../../shared/shared.module';
import { WeatherService } from '../../services/weather.service';
import { WeatherData, WeatherResponse } from '../../core/interfaces/weather.interface';
import { GeocodeService } from '../../services/geocode.service';
import { GeocodeResult } from '../../core/interfaces/geocode.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  weatherData?: WeatherResponse;
  showLastWeek: boolean = false;
  citySearchControl = new FormControl('');
  citySelected: GeocodeResult | null = null;
  filteredCities: Observable<GeocodeResult[]>;
  isLoading: boolean = false;
  isFavorite: boolean = false;
  private readonly STORED_CITY_KEY = environment.storageKeys.STORED_CITY_KEY;
  private readonly FAVORITE_CITIES_KEY = environment.storageKeys.FAVORITE_CITIES_KEY;
  favoriteCities: GeocodeResult[] = [];
  isSmallScreen: boolean = false;
  showFavorites: boolean = false;

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
  
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnInit(): void {
    this.loadFavoriteCities();
    const storedCity = this.getStoredCity();
    if (storedCity) {
      this.citySelected = storedCity;
      this.citySearchControl.setValue(storedCity.name);
      this.isFavorite = this.isSelectedCityFavorite();
      this.loadWeather(storedCity.latitude, storedCity.longitude);
    } else {
      this.loadWeather();
    }
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 1024;
    if (!this.isSmallScreen) {
      this.showFavorites = false;
    }
  }

  toggleFavoritesVisibility(): void {
    this.showFavorites = !this.showFavorites;
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

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.weatherService.getWeather(latitude, longitude).subscribe({
            next: (data) => {
              this.weatherData = data;
              const city: GeocodeResult = {
                name: 'Current Location',
                latitude: latitude,
                longitude: longitude,
                admin: '',
                elevation: '',
                country: '',
                countryCode: '',
                timezone: '',
              }
              this.citySelected = city;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading weather data:', error);
              this.isLoading = false;
            }
          });
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
    this.selectFavoriteCity(city);
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

  displayFn = (city: any): string => {
    return city ? city.name : '';
  }

  private loadFavoriteCities(): void {
    const stored = localStorage.getItem(this.FAVORITE_CITIES_KEY);
    this.favoriteCities = stored ? JSON.parse(stored) : [];
    if (this.citySelected) {
      this.isFavorite = this.favoriteCities.some(city => 
        city.latitude === this.citySelected?.latitude && 
        city.longitude === this.citySelected?.longitude
      );
    }
  }

  private isSelectedCityFavorite(): boolean {
    return this.favoriteCities.some(city => 
      city.latitude === this.citySelected?.latitude && 
      city.longitude === this.citySelected?.longitude
    );
  }

  private saveFavoriteCities(): void {
    localStorage.setItem(this.FAVORITE_CITIES_KEY, JSON.stringify(this.favoriteCities));
  }

  toggleFavorite(): void {
    if (!this.citySelected) return;

    const index = this.favoriteCities.findIndex(city => 
      city.name === this.citySelected?.name && 
      city.longitude === this.citySelected?.longitude
    );

    if (index === -1) {
      this.favoriteCities.push(this.citySelected);
      this.snackBar.open(`${this.citySelected.name} added to favorites`, 'Close', {
        duration: 3000
      });
    } else {
      this.removeFavoriteCity(this.citySelected);
    }

    this.isFavorite = !this.isFavorite;
    this.saveFavoriteCities();
  }

  removeFavoriteCity(city: GeocodeResult): void {
    this.favoriteCities = this.favoriteCities.filter(c => c !== city);
    this.saveFavoriteCities();

    this.snackBar.open(`${city.name} removed from favorites`, 'Close', {
      duration: 3000
    });
  }

  selectFavoriteCity(city: GeocodeResult): void {
    this.citySelected = city;
    this.isFavorite = this.isSelectedCityFavorite();
    this.saveCity(city);
    this.loadWeatherData(city);
  }

  getWeatherIcon(isDay: boolean, code: number = 0): string {
    if (code === undefined || code === null) return '';
    return `weather-${isDay ? 'day' : 'night'}-${code}`;
  }

}
