import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
              public userService: UserService) {
  }

  get userDisplayName(): string {
    return this.userService.isLoggedIn() ? this.userService.getUserDisplayName() : '';
  }

  get isLoggedIn(): boolean {
    return !!this.userService.isLoggedIn();
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      this.userService.setFirebaseUser(firebaseUser);
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
