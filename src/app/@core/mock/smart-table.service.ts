import {Injectable} from '@angular/core';
import { SmartTableData } from '../data/smart-table';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SmartTableService extends SmartTableData {
  deleteData(id: number): Observable<any> {
    const url = `${this.apiUrl}delete/${id}`;
    return this.http.delete(url);
  }

  // @ts-ignore
  getData(): Observable<any> {
    return this.data;
  }

  private readonly apiUrl = environment.apiUrl + '/system/admin/ngx-admin-user/';
  private readonly listApiUrl = this.apiUrl + 'list';

  constructor(private http: HttpClient) {
    super();
  }

  data = this.http.get<any>(this.listApiUrl).pipe(
    map(response => response.content.list), // Use the map operator here;
  );

  saveData(updatedData: any) {
    // 此处的 URL 应替换为您的后端 API 端点
    const url = `${this.apiUrl}save/`;
    return this.http.post(url, updatedData);
  }
}
