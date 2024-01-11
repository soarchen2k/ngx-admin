import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import {DatePipe, NgIf} from '@angular/common';
import {NbCalendarModule, NbCardModule, NbDatepickerModule, NbInputModule} from '@nebular/theme';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'ngx-custom-datepicker',
  standalone: true,
  styleUrls: ['../../../pages/forms/datepicker/datepicker.component.scss'],
  template: `
    <div class="row">
      <div class="col-md-12 col-lg-4 col-xxxl-4">
        <input nbInput
               [(ngModel)]="date"
               (ngModelChange)="onDateSelect($event)"
               placeholder="Form Picker"
               [nbDatepicker]="form_picker">
        <nb-datepicker #form_picker [(date)]="date" (dateChange)="onDateSelect($event)"></nb-datepicker>
      </div>
    </div>
  `,
  imports: [
    DatePipe,
    NbCalendarModule,
    NgIf,
    NbCardModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
  ],
})
export class CustomDatePickerComponent extends DefaultEditor implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter();
  date: Date = null;
  get value(): any {
    return this.cell.getValue();
  }

  ngOnInit() {
    if (this.cell.newValue) {
      this.date = new Date(this.cell.newValue);
    }
  }
  onDateSelect(newDate: Date) {
    if (newDate) {
      const formattedDate = newDate.toISOString();
      this.cell.newValue = formattedDate;

      // 发出一个事件，包含新日期和整个行数据
      this.save.emit({
        newValue: formattedDate,
        rowData: this.cell.getRow().getData(),
      });
    }
  }
}
