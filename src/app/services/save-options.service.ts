import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Options } from '../shared/models/options.model';
import OptionsClass from '../shared/models/options';

@Injectable({
  providedIn: 'root'
})
export class SaveOptionsService {
  optionsRef: AngularFirestoreCollection<Options>;
  options: Observable<Options[]>;
  constructor(private afs: AngularFirestore) {
    this.optionsRef = afs.collection<Options>('options');
    this.options = this.optionsRef.valueChanges();
  }

  // get all teacher options from firebase
  getChoices(): Observable<Options[]> {
    return this.options;
  }

  // combine id, the survey name, and options into one document on firebase
  addOptions(options: Array<string>, surveyName: string) {
    const id = this.afs.createId();
    const firebaseOptions = [];

    for (const optionsArray of options) {
      firebaseOptions.push(optionsArray);
    }
    const newRanking = new OptionsClass(id, surveyName, firebaseOptions);
    this.optionsRef.doc(id).set(Object.assign({}, newRanking));
  }

  deleteOptions(surveyName: string) {

  }
}
