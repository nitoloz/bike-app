import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {auth, User as FirebaseUser} from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  firebaseUser: FirebaseUser;

  constructor(private afStore: AngularFirestore, public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      this.firebaseUser = firebaseUser;
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
