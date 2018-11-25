import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private bikesCollection: AngularFirestoreCollection<any>;
  bikes: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.bikesCollection = afs.collection<any>('bikes');
    this.bikes = this.bikesCollection.valueChanges();
  }

  addItem(bike: any) {
    this.bikesCollection.add(bike);
  }
}
