/// <reference types="@types/googlemaps" />
import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {BikeInfoWindowComponent} from '../bike-info-window/bike-info-window.component';
import {Bike} from '../interfaces/bike';
import {UserService} from './user.service';

const availableBikeIcon = 'bike_blue.png';
const rentedBikeIcon = 'bike_grey.png';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  bikeMarkers = {};
  bikesCollection: AngularFirestoreCollection<Bike> = this.afStore.collection<any>('bikes');
  infoWindowComponentRef: ComponentRef<BikeInfoWindowComponent>;
  bikeInfoWindow: google.maps.InfoWindow;

  constructor(private afStore: AngularFirestore,
              private userService: UserService,
              private injector: Injector,
              private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef) {
  }

  displayBikes(map: google.maps.Map) {
    this.bikeInfoWindow = new google.maps.InfoWindow();
    this.bikeInfoWindow.addListener('closeclick', () => {
      this.infoWindowComponentRef.destroy();
    });

    this.bikesCollection.snapshotChanges().subscribe((bikes: DocumentChangeAction<Bike>[]) => {
      bikes.forEach(bike => {
        this.attachBikeMarkerToMap(map, bike);
      });
    });
  }

  rentBike(bike: DocumentChangeAction<Bike>) {
    if (!this.userService.getRentedBikeId()) {
      this.userService.assignBikeToUser(bike);
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: true});
    }
  }

  returnBike(bike: DocumentChangeAction<Bike>) {
    if (this.userService.getRentedBikeId() === bike.payload.doc.id) {
      this.userService.unassignBikeFromUser();
      this.bikesCollection.doc(bike.payload.doc.id).update({rented: false});
    }
  }

  private showInfoWindow(bike: DocumentChangeAction<Bike>, marker: google.maps.Marker, map: any) {

    if (this.infoWindowComponentRef) {
      this.infoWindowComponentRef.destroy();
    }

    const compFactory = this.resolver.resolveComponentFactory(BikeInfoWindowComponent);
    this.infoWindowComponentRef = compFactory.create(this.injector);

    this.infoWindowComponentRef.instance.bike = bike;
    const div = document.createElement('div');
    div.appendChild(this.infoWindowComponentRef.location.nativeElement);

    this.bikeInfoWindow.setContent(div);
    this.bikeInfoWindow.open(map, marker);

    this.appRef.attachView(this.infoWindowComponentRef.hostView);
    const subscription = this.infoWindowComponentRef.instance.closeWindow.subscribe(x => {
      if (bike.payload.doc.data().rented) {
        this.returnBike(bike);
      } else {
        this.rentBike(bike);
      }
      this.bikeInfoWindow.close();
    });
    this.infoWindowComponentRef.onDestroy(() => {
      this.appRef.detachView(this.infoWindowComponentRef.hostView);
      subscription.unsubscribe();
    });
  }

  private attachBikeMarkerToMap(map: google.maps.Map, bike: DocumentChangeAction<Bike>) {
    const bikeData: Bike = bike.payload.doc.data();
    const bikeLocation = new google.maps.LatLng(bikeData.location.latitude, bikeData.location.longitude);

    if (this.bikeMarkers[bike.payload.doc.id]) {
      this.bikeMarkers[bike.payload.doc.id].setPosition(bikeLocation);
      this.bikeMarkers[bike.payload.doc.id].setIcon(this.getBikeIcon(bikeData.rented));
      this.bikeMarkers[bike.payload.doc.id].bikeDocument = bike;
    } else {
      this.bikeMarkers[bike.payload.doc.id] = new google.maps.Marker({
        position: bikeLocation,
        title: bikeData.name,
        map,
        icon: this.getBikeIcon(bikeData.rented)
      });
      this.bikeMarkers[bike.payload.doc.id].bikeDocument = bike;

      this.bikeMarkers[bike.payload.doc.id].addListener('click', () => {
        this.showInfoWindow(this.bikeMarkers[bike.payload.doc.id].bikeDocument, this.bikeMarkers[bike.payload.doc.id], map);
      });
    }
  }

  private getBikeIcon(isBikeRented: boolean) {
    return {
      url: `assets/${isBikeRented ? rentedBikeIcon : availableBikeIcon}`,
      scaledSize: new google.maps.Size(40, 40)
    };
  }

}
