import {Component, Input, OnInit} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {Bike} from '../interfaces/bike';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-bike-info-window',
  templateUrl: './bike-info-window.component.html',
  styleUrls: ['./bike-info-window.component.scss']
})
export class BikeInfoWindowComponent implements OnInit {

  @Input() bike: DocumentChangeAction<Bike>;

  bikeData: Bike;
  bikeWindowText: any;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.bikeData = this.bike.payload.doc.data();

    this.bikeWindowText = this.bikeData.rented
      ? this.bike.payload.doc.id !== this.userService.getRentedBikeId()
        ? `<p>Sorry, this bike is already rented</p>`
        : `<p>Hey! This is your bike!</p>`
      : this.getAvailableBikeInfoText();
  }

  private getAvailableBikeInfoText() {
    return `<p>This bike is for rent</p>
          <p>1. Click on "Rent Bicycle"</p>
          <p>2. Bicycle lock will unlock automatically</p>
          <p>3. Adjust saddle height</p>`;
  }
}
