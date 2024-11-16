import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherResponse } from '../core/interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.http.get<WeatherResponse>(`${this.apiUrl}/weather?lat=${lat}&lon=${lon}&timezone=${timezone}`);
  }
}
