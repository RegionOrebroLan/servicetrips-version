import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { VersionWrapper } from '../models/version';
import { ErrorHandlerImpl } from './errorhandler';

@Injectable({
  providedIn: 'root'
})
export class VersionService {


  constructor(private http: HttpClient, private errHandler: ErrorHandlerImpl) { }

  getVersion(url: string) : Observable<VersionWrapper> {
    return this.http.get<VersionWrapper>(url)
    .pipe(
      catchError(this.errHandler.handleError<VersionWrapper>("getVersion", "Kunde inte hämta versioner för url: "+url, true))
    )

  }
}
