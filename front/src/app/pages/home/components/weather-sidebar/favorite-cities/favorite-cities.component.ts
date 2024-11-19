import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';
import { FavoriteCitiesService } from '../../../services/favorite-cities.service';

@Component({
  selector: 'app-favorite-cities',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './favorite-cities.component.html',
  styleUrl: './favorite-cities.component.scss'
})
export class FavoriteCitiesComponent implements OnInit, OnDestroy {
  @Output() onCitySelected: EventEmitter<GeocodeResult> = new EventEmitter<GeocodeResult>();

  favoriteCities: GeocodeResult[] = [];
  isSmallScreen: boolean = false;
  showFavorites: boolean = false;

  constructor(
    private readonly favoriteCitiesService: FavoriteCitiesService
  ) {
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.favoriteCitiesService.favoriteCities$.subscribe(favoriteCities => this.favoriteCities = favoriteCities);
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

  handleCitySelection(city: GeocodeResult): void {
    this.onCitySelected.emit(city);
  }

  toggleFavorite(city: GeocodeResult): void { 
    this.favoriteCitiesService.toggleFavorite(city);
  }

  toggleFavoritesVisibility(): void {
    this.showFavorites = !this.showFavorites;
  }

  removeFavoriteCity(city: GeocodeResult): void {
    this.favoriteCitiesService.removeFavoriteCity(city);
  }
  
}
