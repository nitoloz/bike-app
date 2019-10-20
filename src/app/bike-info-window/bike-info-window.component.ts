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

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.bikeData = this.bike.payload.doc.data();
  }

}
