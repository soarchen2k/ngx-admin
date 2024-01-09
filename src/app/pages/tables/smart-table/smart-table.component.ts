import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstname: {
        title: 'First Name',
        type: 'string',
      },
      lastname: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {
  }

  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.source.load(data); // 当数据到达时加载到表格中
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteData(event.data.id).subscribe(response => {
        if (response && response.success) {
          // 从前端数据源中移除该项
          this.source.remove(event.data);
        }
        event.confirm.resolve();
      }, error => {
        // 处理可能出现的错误
        console.error('Error occurred while deleting:', error);
        event.confirm.reject();
      });
    } else {
      event.confirm.reject();
    }
  }
}
