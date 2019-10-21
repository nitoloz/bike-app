/// <reference types="@types/googlemaps" />
import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {UserService} from './user.service';
import {BikeInfoWindowComponent} from '../bike-info-window/bike-info-window.component';

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
              private userService: UserService,
              private injector: Injector,
              private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef) {
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

    // if(this.compRef) this.compRef.destroy();

    // creation component, AppInfoWindowComponent should be declared in entryComponents
    const compFactory = this.resolver.resolveComponentFactory(BikeInfoWindowComponent);
    const compRef = compFactory.create(this.injector);

    // example of parent-child communication
    compRef.instance.bike = bike;
    // const div = document.createElement('div');
    // div.appendChild(this.compRef.location.nativeElement);

    // this.placeInfoWindow.setContent(div);
    // this.placeInfoWindow.open(this.map, marker);

    // it's necessary for change detection within AppInfoWindowComponent
    this.appRef.attachView(compRef.hostView);
    compRef.onDestroy(() => {
      this.appRef.detachView(compRef.hostView);
      // subscription.unsubscribe();
    });
    const div = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);
    this.bikeInfoWindows[bike.payload.doc.id] = new google.maps.InfoWindow({
      content: div
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
