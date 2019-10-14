/// <reference types="@types/googlemaps" />
import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument, DocumentChangeAction} from '@angular/fire/firestore';
import {User as FirebaseUser} from 'firebase/app';
import {combineLatest} from 'rxjs';
import {BikeService} from './bike.service';
import {BikeFirebase} from './interfaces/bike-firebase';
import {UserFirebase} from './interfaces/user-firebase';
import MapOptions = google.maps.MapOptions;

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  map: google.maps.Map;
  user: UserFirebase;
  firebaseUser: FirebaseUser;

  private userDocument: AngularFirestoreDocument<UserFirebase>;

  constructor(private afStore: AngularFirestore,
              public afAuth: AngularFireAuth,
              public bikeService: BikeService) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      this.firebaseUser = firebaseUser;
      if (firebaseUser) {
        this.bikeService.bikesCollection = this.afStore.collection<any>('bikes');
        this.userDocument = this.afStore.doc<any>(`users/${this.firebaseUser.email}`);

        combineLatest(this.userDocument.valueChanges(), this.bikeService.bikesCollection.snapshotChanges())
          .subscribe(([user, bikes]) => {
            this.user = user;
            this.bikeService.displayBikes(bikes);
          });
      }
    });
  }

  ngAfterContentInit() {
    const mapProperties: MapOptions = {
      center: new google.maps.LatLng(initialLatitude, initialLongitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
  }




}
