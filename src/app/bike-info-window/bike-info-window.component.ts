import {Component, EventEmitter, OnInit} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-bike-info-window',
  templateUrl: './bike-info-window.component.html',
  styleUrls: ['./bike-info-window.component.scss']
})
export class BikeInfoWindowComponent implements OnInit {

  bike: DocumentChangeAction<Bike>;
  bikeData: Bike;
  closeWindow = new EventEmitter<void>();

  get isOwnedBike(): boolean {
    return this.bike.payload.doc.id === this.userService.getRentedBikeId();
  }

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.bikeData = this.bike.payload.doc.data();
  }

  submit() {
    this.closeWindow.emit();
  }
}
