import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import { map } from  'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  });
  SERVER_URL: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  public upload(data, userId, isProduct?: boolean) {
    let uploadURL = `${this.SERVER_URL}/business/edit`;
    if (isProduct) {
      uploadURL = `${this.SERVER_URL}/product/update`;
    }

    return this.httpClient.post<any>(uploadURL, data, {
      headers: this.headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return { status: 'progress', message: progress };
          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }
}
