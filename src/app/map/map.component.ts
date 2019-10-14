import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {BikeService} from '../services/bike.service';
import MapOptions = google.maps.MapOptions;

const initialLatitude = 50.119485;
const initialLongitude = 8.639571;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterContentInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  map: google.maps.Map;

  constructor(public bikeService: BikeService) {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    const mapProperties: MapOptions = {
      center: new google.maps.LatLng(initialLatitude, initialLongitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
    this.bikeService.displayBikes(this.map);
  }

}
