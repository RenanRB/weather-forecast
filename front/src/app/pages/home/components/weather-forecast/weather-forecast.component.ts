import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { WeatherData, WeatherResponse } from '../../../../core/interfaces/weather.interface';
import { WeatherIconService } from '../../../../services/weather-icon.service';

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent {
  @Input() weatherList?: WeatherData[];
  @Input() weatherResponse?: WeatherResponse;

  constructor(private readonly weatherIconService: WeatherIconService) {}

  getWeatherIcon(isDay: boolean, weatherCode: number): string {
    return this.weatherIconService.getWeatherIcon(isDay, weatherCode);
  }
}
