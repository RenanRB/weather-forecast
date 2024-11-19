import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class WeatherIconService {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
  }

  registerWeatherIcons() {
    const weatherCodes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
    
    weatherCodes.forEach(code => {
      this.matIconRegistry.addSvgIcon(
        `weather-day-${code}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icon/weather/day-${code}.svg`)
      );

      this.matIconRegistry.addSvgIcon(
        `weather-night-${code}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icon/weather/night-${code}.svg`)
      );
    });
  }

  getWeatherIcon(isDay: boolean, code: number = 0): string {
    if (code === undefined || code === null) return '';
    return `weather-${isDay ? 'day' : 'night'}-${code}`;
  }
} 