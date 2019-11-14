import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {UserService} from './services/user.service';
import {MockUserService} from './services/user.service.spec';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: UserService, useClass: MockUserService}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
