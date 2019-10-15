import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, DocumentChangeAction} from '@angular/fire/firestore';
import {User as FirebaseUser} from 'firebase';
import {Bike} from '../interfaces/bike';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;
  private firebaseUser: FirebaseUser;
  private userDocument: AngularFirestoreDocument<User>;

  constructor(private afStore: AngularFirestore) {
  }

  setFirebaseUser(firebaseUser: FirebaseUser) {
    this.firebaseUser = firebaseUser;
    if (firebaseUser) {
      this.userDocument = this.afStore.doc<any>(`users/${this.firebaseUser.email}`);
      this.userDocument.valueChanges().subscribe(user => this.user = user);

      this.afStore.collection<any>('users').doc(firebaseUser.email)
        .set({name: firebaseUser.displayName}, {merge: true});
    }
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

  unassignBikeFromUser() {
    this.afStore.collection<User>('users').doc(this.getUserEmail())
      .set({
          rentedBikeId: null,
          rentedBikeName: null,
          rentStartTime: null
        } as User, {merge: true}
      );
  }

  assignBikeToUser(bike: DocumentChangeAction<Bike>) {
    this.afStore.collection<User>('users').doc(this.getUserEmail())
      .set({
          rentedBikeId: bike.payload.doc.id,
          rentedBikeName: bike.payload.doc.data().name,
          rentStartTime: Date.now()
        } as User, {merge: true}
      );
  }

}
