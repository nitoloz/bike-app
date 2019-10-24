import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UserService} from '../services/user.service';

import {BikeInfoWindowComponent} from './bike-info-window.component';

describe('BikeInfoWindowComponent', () => {
  let component: BikeInfoWindowComponent;
  let fixture: ComponentFixture<BikeInfoWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BikeInfoWindowComponent],
      providers: [UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeInfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
