import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShearchBarComponent } from './shearch-bar.component';

describe('ShearchBarComponent', () => {
  let component: ShearchBarComponent;
  let fixture: ComponentFixture<ShearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShearchBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
