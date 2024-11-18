import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { WeatherIconService } from './services/weather-icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weather-forecast';

  constructor(private readonly weatherIconService: WeatherIconService) {
    this.weatherIconService.registerWeatherIcons();
  }
}
