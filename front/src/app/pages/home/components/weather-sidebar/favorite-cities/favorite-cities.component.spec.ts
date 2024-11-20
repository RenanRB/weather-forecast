import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteCitiesComponent } from './favorite-cities.component';
import { FavoriteCitiesService } from '../../../services/favorite-cities.service';
import { BehaviorSubject } from 'rxjs';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';

describe('FavoriteCitiesComponent', () => {
  let component: FavoriteCitiesComponent;
  let fixture: ComponentFixture<FavoriteCitiesComponent>;
  let favoriteCitiesService: jest.Mocked<FavoriteCitiesService>;
  
  const mockCity: GeocodeResult = {
    latitude: -23.5505,
    longitude: -46.6333,
    elevation: '760m',
    name: 'São Paulo',
    admin: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    timezone: 'America/Sao_Paulo'
  };

  beforeEach(async () => {
    const favoriteCitiesSubject = new BehaviorSubject<GeocodeResult[]>([mockCity]);
    
    favoriteCitiesService = {
      favoriteCities$: favoriteCitiesSubject.asObservable(),
      toggleFavorite: jest.fn(),
      removeFavoriteCity: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [FavoriteCitiesComponent],
      providers: [
        { provide: FavoriteCitiesService, useValue: favoriteCitiesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with favorite cities from service', () => {
    expect(component.favoriteCities).toEqual([mockCity]);
  });

  it('should emit selected city when handleCitySelection is called', () => {
    const emitSpy = jest.spyOn(component.onCitySelected, 'emit');
    
    component.handleCitySelection(mockCity);
    
    expect(emitSpy).toHaveBeenCalledWith(mockCity);
  });

  it('should toggle favorites visibility', () => {
    expect(component.showFavorites).toBeFalsy();
    
    component.toggleFavoritesVisibility();
    expect(component.showFavorites).toBeTruthy();
    
    component.toggleFavoritesVisibility();
    expect(component.showFavorites).toBeFalsy();
  });

  it('should call service to remove favorite city', () => {
    component.removeFavoriteCity(mockCity);
    
    expect(favoriteCitiesService.removeFavoriteCity).toHaveBeenCalledWith(mockCity);
  });

  it('should call service to toggle favorite city', () => {
    component.toggleFavorite(mockCity);
    
    expect(favoriteCitiesService.toggleFavorite).toHaveBeenCalledWith(mockCity);
  });

  describe('Screen size handling', () => {
    it('should set isSmallScreen to true when window width is <= 1024', () => {
      window.innerWidth = 1024;
      component['checkScreenSize']();
      
      expect(component.isSmallScreen).toBeTruthy();
    });

    it('should set isSmallScreen to false when window width is > 1024', () => {
      window.innerWidth = 1025;
      component['checkScreenSize']();
      
      expect(component.isSmallScreen).toBeFalsy();
    });

    it('should hide favorites when screen becomes large', () => {
      component.showFavorites = true;
      window.innerWidth = 1025;
      
      component['checkScreenSize']();
      
      expect(component.showFavorites).toBeFalsy();
    });
  });

  it('should clean up resize listener on destroy', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    component.ngOnDestroy();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize', 
      expect.any(Function)
    );
  });
}); 