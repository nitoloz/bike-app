import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/user.service.spec';

import {NavbarComponent} from './navbar.component';

export class MockAngularFireAuth {
  userSubject = new BehaviorSubject<User>(null);
  user = this.userSubject.asObservable();

  auth = {
    signInWithPopup: (provide: auth.GoogleAuthProvider) => {
    },

    signOut: () => {
    }
  };
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        {provide: UserService, useClass: MockUserService},
        {provide: AngularFireAuth, useClass: MockAngularFireAuth}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user to user service after login', () => {
    const angularFireAuth: MockAngularFireAuth = TestBed.get(AngularFireAuth);
    const userService: UserService = TestBed.get(UserService);
    spyOn(userService, 'setFirebaseUser');
    const mockUser = {email: 'mockuser@gmail.com'} as User;
    angularFireAuth.userSubject.next(mockUser);
    expect(userService.setFirebaseUser).toHaveBeenCalledWith(mockUser);
  });

  it('should open auth popup if login method is called', () => {
    const angularFireAuth: AngularFireAuth = TestBed.get(AngularFireAuth);
    spyOn(angularFireAuth.auth, 'signInWithPopup');
    component.login();
    expect(angularFireAuth.auth.signInWithPopup).toHaveBeenCalledWith(new auth.GoogleAuthProvider());
  });

  it('should logout if logout method is called', () => {
    const angularFireAuth: AngularFireAuth = TestBed.get(AngularFireAuth);
    spyOn(angularFireAuth.auth, 'signOut');
    component.logout();
    expect(angularFireAuth.auth.signOut).toHaveBeenCalled();
  });

});
