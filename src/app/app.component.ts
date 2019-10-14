/// <reference types="@types/googlemaps" />
import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {User} from './interfaces/user';
import {BikeService} from './services/bike.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private userDocument: AngularFirestoreDocument<User>;

  constructor(private afStore: AngularFirestore,
              public afAuth: AngularFireAuth,
              public userService: UserService) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      this.userService.firebaseUser = firebaseUser;
      if (firebaseUser) {
        this.userDocument = this.afStore.doc<any>(`users/${firebaseUser.email}`);

        this.userDocument.valueChanges()
          .subscribe(user => {
            this.userService.user = user;
          });
      }
    });
  }
}
