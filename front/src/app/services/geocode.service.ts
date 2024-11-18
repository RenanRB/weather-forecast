import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeocodeResult } from '../core/interfaces/geocode.interface';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  searchCities(query: string): Observable<GeocodeResult[]> {
    if (!query || query.length < 3) {
      return of([]);
    }
    return this.http.get<GeocodeResult[]>(`${this.apiUrl}/cities?location=${query}`).pipe(
      catchError((error) => {
        console.error('Error fetching cities:', error);
        return of([]);
      })
    );
  }
}
