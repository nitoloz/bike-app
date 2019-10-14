import {Injectable} from '@angular/core';
import {User as FirebaseUser} from 'firebase';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  firebaseUser: FirebaseUser;

  constructor() {
  }

  isLoggedIn() {
    return this.firebaseUser;
  }

  getUserDisplayName() {
    return this.firebaseUser.displayName;
  }

  getUserEmail() {
    return this.firebaseUser.email;
  }

  hasBikeRented() {
    return this.user && this.user.rentedBikeId;
  }

  getRentedBikeName() {
    return this.user && this.user.rentedBikeName;
  }

  getRentedBikeId() {
    return this.user && this.user.rentedBikeId;
  }

  getRentedBikeStartTime() {
    return this.user && this.user.rentStartTime;
  }

}
