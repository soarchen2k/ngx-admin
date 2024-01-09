import {Injectable} from '@angular/core';
import { SmartTableData } from '../data/smart-table';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SmartTableService extends SmartTableData {
  deleteData(id: number): Observable<any> {
    const url = `${environment.apiUrl}/api/system/admin/ngx-admin-user/delete/${id}`;
    return this.http.delete(url);
  }

  // @ts-ignore
  getData(): Observable<any> {
    return this.data;
  }

  private readonly apiUrl = environment.apiUrl + '/api/system/admin/ngx-admin-user/list';

  constructor(private http: HttpClient) {
    super();
  }

  data = this.http.get<any>(this.apiUrl).pipe(
    map(response => response.content.list), // Use the map operator here;
  );
}
