import { SaveOptionsService } from '../services/save-options.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  selectedOption: string;
  selectedOptionsArray: Array<number>;

  options = [
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
    {name: '7'},
    {name: '8'},
    {name: '9'},
    {name: '10'}
  ];

  result = [];

  constructor(private saveOptionService: SaveOptionsService) { }

  ngOnInit() {

  }

  updateOptions() {
    this.selectedOptionsArray = new Array(parseInt(this.selectedOption, 10));
    console.log(this.selectedOption, this.selectedOptionsArray);
    // this.options.length = this.options.value;
  }

  submitOptions() {
    console.log('Selected Array', this.selectedOptionsArray);
    for (let i = 0; i < this.selectedOptionsArray.length; i++) {
      /*
      * if option is not undefined
      * result.push(option)
      */

      this.result[i] = this.selectedOptionsArray[i];
    }
    console.log('result is', this.result);

    this.saveOptionService.addOptions(this.result);
    console.log('result is after service called', this.result);
  }

  indexTracker(index: number, value: any) {
    return index;
  }
}