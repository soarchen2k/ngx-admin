import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {SmartTableData} from '../../../@core/data/smart-table';
import {CustomDatePickerComponent} from '../../../@core/utils/common-templates/custom-date-picker.component';
import {CustomDateViewComponent} from '../../../@core/utils/common-templates/CustomDateViewComponent';

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
      confirmCreate: true, // 创建时是否需要确认
      mode: 'inline', // 行内编辑模式
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true, // 保存时是否需要确认
      mode: 'inline', // 行内编辑模式
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false, // 不可编辑
        addable: false, // 不可添加
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
        type: 'text', // 直接显示文本，因为年龄是预先计算的
        addable: false,
        editable: false,
      },
      birthdate: {
        title: '生日',
        type: 'custom',
        renderComponent: CustomDateViewComponent, // 显示组件
        editor: {
          type: 'custom',
          component: CustomDatePickerComponent, // 编辑器组件
        },
        editable: true,
        addable: true,
      },
    },
    pager: {
      display: true,
      perPage: 10, // 默认每页显示10条数据
    },
  };

  source: LocalDataSource = new LocalDataSource();
  perPageOptions = [10, 20, 50, 100]; // 每页显示条数的下拉选项

  constructor(private service: SmartTableData) {
  }

  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.processData(data); // 使用新的处理数据的方法
    });
  }

  onDeleteConfirm(event: { data: { id: number; }; confirm: { resolve: () => void; reject: () => void; }; }): void {
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


  onPerPageChange(perPage: number): void {
    this.settings = {
      ...this.settings,
      pager: {
        ...this.settings.pager,
        perPage: perPage,
      },
    };
    this.source.setPaging(1, perPage, true);
  }

  calculateAge(birthdate: string | Date): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  processData(data: any[]) {
    const updatedData = data.map(item => ({
      ...item,
      age: this.calculateAge(item.birthdate), // 计算年龄
    }));
    this.source.load(updatedData);
  }

  onEditConfirm(event: { data: any; newData: any; confirm: { resolve: () => void; reject: () => void; }; }): void {
    if (this.validateForm(event)) { // 验证表单)
      this.service.saveData(event.newData).subscribe(
        response => {
          // 更新生日数据
          if (event.data == null || event.newData.birthdate !== event.data.birthdate) {
            // 如果生日发生了变化，更新年龄
            event.newData.age = this.calculateAge(event.newData.birthdate);

            // 调用 source 的 update 方法更新整行数据
            this.source.update(event.data, event.newData).then(() => {
              this.source.refresh(); // 刷新表格以显示新的数据
            });
          }
          // 处理响应
          event.confirm.resolve();
        },
        error => {
          // 处理错误
          console.error('Error saving data', error);
          event.confirm.reject();
        },
      );
    }
  }

  private validateForm(event: { newData: any; confirm: { reject: () => void; }; }): boolean {
    if (!event.newData.firstname.trim() || !event.newData.lastname.trim()
      || !event.newData.username.trim() || !event.newData.email.trim()
      || event.newData.birthdate == null) {
      window.alert('请填写完整的表单数据');
      event.confirm.reject();
      return false;
    }
    return true;
  }
}
