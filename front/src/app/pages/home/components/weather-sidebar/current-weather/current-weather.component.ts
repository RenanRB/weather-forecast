import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';
import { WeatherResponse } from '../../../../../core/interfaces/weather.interface';
import { WeatherIconService } from '../../../../../services/weather-icon.service';
import { FavoriteCitiesService } from '../../../services/favorite-cities.service';
import { SelectedCityService } from '../../../services/selected-city.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent implements OnInit {

  @Input() set weatherData(value: WeatherResponse | undefined) {
    if (value) {
      this._weatherData = value;
    }
  }

  get weatherData(): WeatherResponse | undefined {
    return this._weatherData;
  }

  @Input() set citySelected(value: GeocodeResult) {
    if (value) {
      this._citySelected = value;
      this.isFavorite = this.favoriteCitiesService.isFavorite(this.citySelected);
    }
  }

  get citySelected(): GeocodeResult {
    return this._citySelected;
  }

  isFavorite: boolean = false;

  private _citySelected!: GeocodeResult;
  private _weatherData!: WeatherResponse;

  constructor(
    private readonly weatherIconService: WeatherIconService,
    private readonly favoriteCitiesService: FavoriteCitiesService,
    private readonly selectedCityService: SelectedCityService,
  ) {}

  ngOnInit(): void {
    this.selectedCityService.selectedCity$.subscribe(city => {
      if (city) {
        this.citySelected = city;
      }
    });

    this.favoriteCitiesService.favoriteCities$.subscribe(favoriteCities => {
      if (this.citySelected) {
        this.isFavorite = this.favoriteCitiesService.isFavorite(this.citySelected);
      }
    }); 
  }

  getWeatherIcon(isDay: boolean, code: number = 0): string {
    return this.weatherIconService.getWeatherIcon(isDay, code);
  }

  toggleFavorite(): void {
    if (this.citySelected) {
      this.favoriteCitiesService.toggleFavorite(this.citySelected);
      this.isFavorite = this.favoriteCitiesService.isFavorite(this.citySelected);
    }
  }

}
