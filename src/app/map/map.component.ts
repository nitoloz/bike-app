import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {BikeService} from '../services/bike.service';
import {UserService} from '../services/user.service';
import MapOptions = google.maps.MapOptions;

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterContentInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  private map: google.maps.Map;

  constructor(private bikeService: BikeService,
              private userService: UserService) {
  }

  get hasBikeRented(): boolean {
    return !!this.userService.hasBikeRented();
  }

  get rentedBikeName(): string {
    return this.userService.getRentedBikeName();
  }

  get bikeRentalStartTime(): number {
    return this.userService.getBikeRentalStartTime();
  }

  ngAfterContentInit() {
    this.initMap();
    this.bikeService.bikesCollection.snapshotChanges().subscribe((bikes: DocumentChangeAction<Bike>[]) => {
      bikes.forEach(bike => {
        this.bikeService.attachBikeMarkerToMap(this.map, bike);
      });
    });
  }

  private initMap() {
    const mapProperties: MapOptions = {
      center: new google.maps.LatLng(initialLatitude, initialLongitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
  }

}
