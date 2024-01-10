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
}
