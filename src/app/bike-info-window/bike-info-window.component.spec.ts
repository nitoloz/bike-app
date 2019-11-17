import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UserService} from '../services/user.service';

import {BikeInfoWindowComponent} from './bike-info-window.component';
import {MockUserService} from '../services/user.service.spec';
import {Bike} from '../interfaces/bike';

describe('BikeInfoWindowComponent', () => {
  let component: BikeInfoWindowComponent;
  let fixture: ComponentFixture<BikeInfoWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BikeInfoWindowComponent],
      providers: [{provide: UserService, useClass: MockUserService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeInfoWindowComponent);
    component = fixture.componentInstance;
    component.bike = {
      payload: {
        doc: {
          data() {
            return {} as Bike;
          }
        }
      }
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
