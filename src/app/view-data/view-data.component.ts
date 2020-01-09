import { Component, OnInit } from '@angular/core';
import { RankVotesService } from '../services/rank-votes.service';
import { GetAllChoicesService } from '../services/get-all-choices.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GetOptionsService } from '../services/get-options.service';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Choice } from '../shared/models/choice.model';
import { Options } from '../shared/models/options.model';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss']
})
export class ViewDataComponent implements OnInit {
  winner: string;
  solution: string;
  dataLeft: string[][]; // List of student choices. (List of list of strings)
  candidatesLeft: string[]; // List of option names. (List of strings)
  choicesRef: AngularFirestoreCollection<Choice>;
  choices: Observable<Choice[]>;
  newArray;
  constructor(
    private getOptionsService: GetOptionsService,
    private afs: AngularFirestore,
    private getAllChoicesService: GetAllChoicesService
  ) {
    this.choicesRef = afs.collection<Choice>('choices');
    this.choices = this.choicesRef.valueChanges();
    this.solution = '';
    // this.rankVotesService = new RankVotesService(candidates, data);
  }

  ngOnInit() {
    // this.rankVotesService = new RankVotesService(firebasedata)
    // this.winner = this.rankVotesService.solve();
  }

  async fetchAndSolve() {
    await this.TeacherOptions();
    await this.StudentChoices();
    this.solution = this.solve();

    return this.solution;
  }

  async TeacherOptions() {
    this.candidatesLeft = await new Promise((resolve, reject) => {

      this.getOptionsService.getOptions().subscribe((options) => {
        resolve(options[Object.keys(options)[0]].tasks);
      });

    });
  }

  async StudentChoices() {
    this.dataLeft = await new Promise((resolve, reject) => {
      this.getAllChoicesService.getStudentResponses().subscribe((studentChoices) => {

        resolve(
          studentChoices.map((element) => {
            return element.ranking;
          }),
        );
      });
    });

  }

  findRoundScores() {
    let roundScores = {};

    // Give a score based on first-place votes.
    for (let i = 0; i < this.dataLeft.length; i++) {
      if (!roundScores[this.dataLeft[i][0]]) {
        roundScores[this.dataLeft[i][0]] = 0;
      }

      roundScores[this.dataLeft[i][0]]++;
    }

    return roundScores;
  }

  solve() {
    // Go through all of the rounds
    while (this.candidatesLeft.length > 2) {
      let roundScores = this.findRoundScores();

      // Give a score based on first-place votes.
      for (let i = 0; i < this.dataLeft.length; i++) {
        if (!roundScores[this.dataLeft[i][0]]) {
          roundScores[this.dataLeft[i][0]] = 0;
        }

        roundScores[this.dataLeft[i][0]]++;
      }

      let worstCandidate;
      let worstCandidateScore = -1;

      // Find candidate with lowest first-place votes.
      for (let candidate of this.candidatesLeft) {
        if (worstCandidateScore === -1 || roundScores[candidate] < worstCandidateScore) {
          worstCandidate = candidate;
          worstCandidateScore = roundScores[candidate];
        }
      }

      // Remove them from the remaining candidates.
      this.candidatesLeft.splice(this.candidatesLeft.indexOf(worstCandidate), 1);

      // Remove them from the candidate votes so that lower candidates rise up.
      for (let i = 0; i < this.dataLeft.length; i++) {
        this.dataLeft[i].splice(this.dataLeft[i].indexOf(worstCandidate), 1);
      }
    }

    let roundScores = this.findRoundScores();

    // Compare the final two candidates and return the better one.
    if (roundScores[this.candidatesLeft[0]] > roundScores[this.candidatesLeft[1]]) {
      return this.candidatesLeft[0];
    } else {
      return this.candidatesLeft[1];
    }
  }
}
