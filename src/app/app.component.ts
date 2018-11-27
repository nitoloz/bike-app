/// <reference types="@types/googlemaps" />
import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;
const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  private bikesCollection: AngularFirestoreCollection<any>;
  bikes: Observable<any[]>;
  selectedMarkerType = 'cycling.png';

  constructor(private afs: AngularFirestore) {
    this.bikesCollection = afs.collection<any>('bikes');
    this.bikes = this.bikesCollection.valueChanges();
    this.bikes.subscribe(bikes => {
      bikes.forEach(bike => {
        const bikeLocation = new google.maps.LatLng(bike.location.latitude, bike.location.longitude);

        const marker = new google.maps.Marker({
          position: bikeLocation,
          title: bike.name,
          map: this.map,
          icon: {
            url: iconBase + this.selectedMarkerType,
            scaledSize: new google.maps.Size(30, 30)
          }
        });
      });
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

  addItem(bike: any) {
    this.bikesCollection.add(bike);
  }
}
