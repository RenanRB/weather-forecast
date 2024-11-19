import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { WeatherResponse } from '../../../../core/interfaces/weather.interface';

@Component({
  selector: 'app-weather-highlights',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './weather-highlights.component.html',
  styleUrl: './weather-highlights.component.scss'
})
export class WeatherHighlightsComponent {
  @Input() weatherResponse?: WeatherResponse;
}
