/// <reference types="@types/googlemaps" />
import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {combineLatest, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase/app';

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;
const availableBikeIcon = 'bike_blue.png';
const rentedBikeIcon = 'bike_grey.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  user: any;

  firebaseUser: User;

  private bikesCollection: AngularFirestoreCollection<any>;
  private userDocument: AngularFirestoreDocument<any>;

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
    const mapProperties = {
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

  private rentBike(bike: any) {
    if (!this.user.rentedBikeId) {
      this.afStore.collection<any>('users').doc(this.firebaseUser.email)
        .set({
            rentedBikeId: bike.payload.doc.id,
            rentedBikeName: bike.payload.doc.data().name
          }, {merge: true}
        );
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: true});
    } else {
      alert(`Please return first bike ${this.user.rentedBikeName}!`);
    }
  }

  private returnBike(bike: any) {
    if (this.user.rentedBikeId === bike.payload.doc.id) {
      this.afStore.collection<any>('users').doc(this.firebaseUser.email)
        .set({
            rentedBikeId: null,
            rentedBikeName: null
          }, {merge: true}
        );
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: false});
    } else {
      alert(`This is not your bike!`);
    }
  }

  private displayBikes(bikes: any[]) {
    bikes.forEach(bike => {
      const bikeData = bike.payload.doc.data();
      const bikeLocation = new google.maps.LatLng(bikeData.location.latitude, bikeData.location.longitude);
      const infoWindow = new google.maps.InfoWindow({
        content: `<div>
                    <h3>Bike ${bikeData.name}</h3>
                    <button style="float:right;" id="${bike.payload.doc.id}">
                      ${bikeData.rented ? 'Return!' : 'Rent!'}
                    </button>
                  </div>`
      });

      google.maps.event.addListener(infoWindow, 'domready', () => {
        document.getElementById(bike.payload.doc.id).addEventListener('click', (e) => {
          if (bike.payload.doc.data().rented) {
            this.returnBike(bike);
          } else {
            this.rentBike(bike);
          }
          infoWindow.close();
        });
      });

      const marker = new google.maps.Marker({
        position: bikeLocation,
        title: bikeData.name,
        map: this.map,
        icon: {
          url: `assets/${bikeData.rented ? rentedBikeIcon : availableBikeIcon}`,
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }
}
