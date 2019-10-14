import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {auth, User as FirebaseUser} from 'firebase';
import {BikeService} from '../services/bike.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private afStore: AngularFirestore, public afAuth: AngularFireAuth,
              public userService: UserService) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.afStore.collection<any>('users').doc(firebaseUser.email)
          .set({name: firebaseUser.displayName}, {merge: true});
      }
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
