/// <reference types="@types/googlemaps" />
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {UserService} from './user.service';

const availableBikeIcon = 'bike_blue.png';
const rentedBikeIcon = 'bike_grey.png';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  bikeMarkers = {};
  bikeInfoWindows = {};
  bikesCollection: AngularFirestoreCollection<Bike> = this.afStore.collection<any>('bikes');

  constructor(private afStore: AngularFirestore,
              private userService: UserService) {
  }

  displayBikes(map: google.maps.Map) {
    this.bikesCollection.snapshotChanges().subscribe((bikes: DocumentChangeAction<Bike>[]) => {
      bikes.forEach(bike => {
        this.appendInfoWindow(bike);
        this.attachBikeMarkerToMap(map, bike);
      });
    });
  }

  private appendInfoWindow(bike: DocumentChangeAction<Bike>) {
    // const bikeData = bike.payload.doc.data();

    if (this.bikeInfoWindows[bike.payload.doc.id]) {
      this.bikeInfoWindows[bike.payload.doc.id] = null;
    }
    //
    // const bikeWindowText = bikeData.rented
    //   ? bike.payload.doc.id !== this.userService.getRentedBikeId()
    //     ? `<p>Sorry, this bike is already rented</p>`
    //     : `<p>Hey! This is your bike!</p>`
    //   : this.getAvailableBikeInfoText();
    //
    // const buttonElement = bikeData.rented && this.userService.getRentedBikeId() !== bike.payload.doc.id
    //   ? `<button class="btn btn-primary" disabled style="float:right;" id="${bike.payload.doc.id}">
    //     ${bikeData.rented ? 'Return Bike' : 'Rent Bike'}
    //     </button>`
    //   : `<button class="btn btn-primary" style="float:right;" id="${bike.payload.doc.id}">
    //     ${bikeData.rented ? 'Return Bike' : 'Rent Bike'}
    //     </button>`;

    this.bikeInfoWindows[bike.payload.doc.id] = new google.maps.InfoWindow({
      content: `<app-bike-info-window [bike]="bike"></app-bike-info-window>`
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

  private attachBikeMarkerToMap(map: google.maps.Map, bike: DocumentChangeAction<Bike>) {
    const bikeData: Bike = bike.payload.doc.data();
    const bikeLocation = new google.maps.LatLng(bikeData.location.latitude, bikeData.location.longitude);

    if (this.bikeMarkers[bike.payload.doc.id]) {
      this.bikeMarkers[bike.payload.doc.id].setPosition(bikeLocation);
      this.bikeMarkers[bike.payload.doc.id].setIcon(this.getBikeIcon(bikeData.rented));
    } else {
      this.bikeMarkers[bike.payload.doc.id] = new google.maps.Marker({
        position: bikeLocation,
        title: bikeData.name,
        map,
        icon: this.getBikeIcon(bikeData.rented)
      });
      this.bikeMarkers[bike.payload.doc.id].addListener('click', () => {
        this.bikeInfoWindows[bike.payload.doc.id].open(map, this.bikeMarkers[bike.payload.doc.id]);
      });
    }
  }

  private rentBike(bike: DocumentChangeAction<Bike>) {
    if (!this.userService.getRentedBikeId()) {
      this.userService.assignBikeToUser(bike);
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: true});
    }
  }

  private returnBike(bike: DocumentChangeAction<Bike>) {
    if (this.userService.getRentedBikeId() === bike.payload.doc.id) {
      this.userService.unassignBikeFromUser();
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: false});
    }
  }

  private getBikeIcon(isBikeRented: boolean) {
    return {
      url: `assets/${isBikeRented ? rentedBikeIcon : availableBikeIcon}`,
      scaledSize: new google.maps.Size(40, 40)
    };
  }

}
