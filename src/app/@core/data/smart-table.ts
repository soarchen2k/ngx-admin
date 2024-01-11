import {Observable} from 'rxjs';

export abstract class SmartTableData {
  abstract getData(): Observable<any>;
  abstract deleteData(id: number): Observable<any>;
  abstract saveData(updatedData: any): Observable<any>;
}
