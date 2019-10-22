import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {UserService} from '../services/user.service';
import {BikeService} from '../services/bike.service';

@Component({
  selector: 'app-bike-info-window',
  templateUrl: './bike-info-window.component.html',
  styleUrls: ['./bike-info-window.component.scss']
})
export class BikeInfoWindowComponent implements OnInit {

  bike: DocumentChangeAction<Bike>;
  bikeData: Bike;
  closeWindow = new EventEmitter<void>();


  constructor(public userService: UserService, private bikeService: BikeService) {
  }

  ngOnInit() {
    this.bikeData = this.bike.payload.doc.data();
  }

  rentOrReturn() {
    if (this.bikeData.rented) {
      this.bikeService.returnBike(this.bike);
    } else {
      this.bikeService.rentBike(this.bike);
    }
    this.closeWindow.emit();
  }
}
