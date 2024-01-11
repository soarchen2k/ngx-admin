import { Component, Input } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'ngx-custom-date-view',
  template: `
    <div class="text-body">
      {{ value | date }}
    </div>
  `,
  standalone: true,
  imports: [
    DatePipe,
  ],
})
export class CustomDateViewComponent {
  @Input() value: string | number;
}
