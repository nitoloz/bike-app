/// <reference types="@types/googlemaps" />
import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction} from '@angular/fire/firestore';
import {auth, User as FirebaseUser} from 'firebase/app';
import {combineLatest} from 'rxjs';
import {BikeFirebase} from './interfaces/bike-firebase';
import {UserFirebase} from './interfaces/user-firebase';
import MapOptions = google.maps.MapOptions;

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;
const availableBikeIcon = 'bike_blue.png';
const rentedBikeIcon = 'bike_grey.png';

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

  private bikesCollection: AngularFirestoreCollection<BikeFirebase>;
  private userDocument: AngularFirestoreDocument<UserFirebase>;
  private bikeMarkers = {};
  private bikeInfoWindows = {};

  constructor(private afStore: AngularFirestore,
              public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(firebaseUser => {
      this.firebaseUser = firebaseUser;
      if (firebaseUser) {
        this.afStore.collection<any>('users').doc(firebaseUser.email)
          .set({name: firebaseUser.displayName}, {merge: true});
        this.bikesCollection = this.afStore.collection<any>('bikes');
        this.userDocument = this.afStore.doc<any>(`users/${this.firebaseUser.email}`);

        combineLatest(this.userDocument.valueChanges(), this.bikesCollection.snapshotChanges())
          .subscribe(([user, bikes]) => {
            this.user = user;
            this.displayBikes(bikes);
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

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  private displayBikes(bikes: DocumentChangeAction<BikeFirebase>[]) {
    bikes.forEach(bike => {
      this.attachInfoWindow(bike);
      this.attachMarker(bike);
    });
  }

  private rentBike(bike: DocumentChangeAction<BikeFirebase>) {
    if (!this.user.rentedBikeId) {
      this.afStore.collection<UserFirebase>('users').doc(this.firebaseUser.email)
        .set(<UserFirebase>{
            rentedBikeId: bike.payload.doc.id,
            rentedBikeName: bike.payload.doc.data().name,
            rentStartTime: Date.now()
          }, {merge: true}
        );
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: true});
    }
  }

  private returnBike(bike: DocumentChangeAction<BikeFirebase>) {
    if (this.user.rentedBikeId === bike.payload.doc.id) {
      this.afStore.collection<UserFirebase>('users').doc(this.firebaseUser.email)
        .set(<UserFirebase>{
            rentedBikeId: null,
            rentedBikeName: null,
            rentStartTime: null
          }, {merge: true}
        );
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: false});
    }
  }

  private attachInfoWindow(bike: DocumentChangeAction<BikeFirebase>) {
    const bikeData = bike.payload.doc.data();

    if (this.bikeInfoWindows[bike.payload.doc.id]) {
      this.bikeInfoWindows[bike.payload.doc.id] = null;
    }

    const bikeWindowText = bikeData.rented
      ? bike.payload.doc.id !== this.user.rentedBikeId
        ? `<p>Sorry, this bike is already rented</p>`
        : `<p>Hey! This is your bike!</p>`
      : `<p>This bike is for rent</p>
          <p>1. Click on "Rent Bicycle"</p>
          <p>2. Bicycle lock will unlock automatically</p>
          <p>3. Adjust saddle height</p>`;

    const buttonElement = bikeData.rented && this.user.rentedBikeId !== bike.payload.doc.id
      ? `<button class="btn btn-primary" disabled style="float:right;" id="${bike.payload.doc.id}">
        ${bikeData.rented ? 'Return Bike' : 'Rent Bike'}
        </button>`
      : `<button class="btn btn-primary" style="float:right;" id="${bike.payload.doc.id}">
        ${bikeData.rented ? 'Return Bike' : 'Rent Bike'}
        </button>`;

    this.bikeInfoWindows[bike.payload.doc.id] = new google.maps.InfoWindow({
      content: `<div class="mt-2 text-left">
                    <h5>Bike ${bikeData.name}</h5>
                    ${bikeWindowText}
                    ${buttonElement}
                </div>`
    });

    google.maps.event.addListener(this.bikeInfoWindows[bike.payload.doc.id], 'domready', () => {
      document.getElementById(bike.payload.doc.id).addEventListener('click', () => {
        if (bike.payload.doc.data().rented) {
          this.returnBike(bike);
        } else {
          this.rentBike(bike);
        }
        this.bikeInfoWindows[bike.payload.doc.id].close();
      });
    });
  }

  private attachMarker(bike: DocumentChangeAction<BikeFirebase>) {
    const bikeData: BikeFirebase = bike.payload.doc.data();
    const bikeLocation = new google.maps.LatLng(bikeData.location.latitude, bikeData.location.longitude);

    if (this.bikeMarkers[bike.payload.doc.id]) {
      this.bikeMarkers[bike.payload.doc.id].setPosition(bikeLocation);
      this.bikeMarkers[bike.payload.doc.id].setIcon({
        url: `assets/${bikeData.rented ? rentedBikeIcon : availableBikeIcon}`,
        scaledSize: new google.maps.Size(40, 40)
      });
    } else {
      this.bikeMarkers[bike.payload.doc.id] = new google.maps.Marker({
        position: bikeLocation,
        title: bikeData.name,
        map: this.map,
        icon: {
          url: `assets/${bikeData.rented ? rentedBikeIcon : availableBikeIcon}`,
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      this.bikeMarkers[bike.payload.doc.id].addListener('click', () => {
        this.bikeInfoWindows[bike.payload.doc.id].open(this.map, this.bikeMarkers[bike.payload.doc.id]);
      });
    }
  }

}
