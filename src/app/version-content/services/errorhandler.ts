import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { CookieService } from 'ngx-cookie-service';
//import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerImpl implements ErrorHandler {
//private toastr: ToastrService,
  constructor( private router: Router) { }

  /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
* @param message - optional message for output
*/
  handleError<T>(operation = 'operation', message = '', appendError = false, result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error("error: " + error); // log to console instead

      console.log(`${operation} failed: ${error.message}, custom message: ${message}`);

      var displayErr: boolean = true;
      if (operation == "getSession" && error.status === 401) {
        //gammal cookie men ingen aktiv session, ge inget felmeddelande.
        displayErr = false;
      }


      if (message === '' || appendError) {
        if (appendError) {
          message += "\n";
        }
        if (error.error != null && error.error != "") {
          if (typeof error.error === "string") {
            message += error.error;
          } else if (error.error.errors) {
            //funkar bara om det finns en key med "Name" i errors
            // if (typeof error.error.errors?.Name[0] === "string") { 

            //   message += error.status + ": " + error.error.errors.Name[0];
            // }
            this.iterateErrors(error.error.errors, message);
          } else {
            message += "Någonting gick fel, " + error.status + ": " + error.statusText;
          }
        } else if (error.message != null && error.message != "") {
          message += error.message;
        } else if (error.status == 400) {
          message += error.statusText.toString();
        } else {
          message += "Någonting gick fel, " + error.status + ": " + error.statusText;
        }
      }

      //Display error dialog to user.
//      if (displayErr) {
//        this.toastr.error(message);
//      }

      //Reload, or the content in the failed box will not be updated.
      // confirmDialogRef.afterClosed().subscribe(() => {
      //   window.location.reload();
      // });
      // Let the app keep running by returning an empty result.
      //return of(result as T);
      // Throw error upwards
      return throwError(() => error);
    };

  }

  private iterateErrors(errors: any, message?: string) {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const error = `\n${key}: ${errors[key].join(', ')}`;
        if (message) {
          message += error;
        }
        console.error(`Iterated error: ${error}`);
      }
    }
  }
  /**
   * 
   * @param message The message to display
   * @param {ErrorhandlerService.ToastrType | null} type - The ToastrType to display. If it is null, the default ToastrType is 'Success'.
   * @returns {ActiveToast<any>} an 'ActiveToast'
   */
 // displayMessageToUser(message: string, type: ErrorhandlerService.ToastrType | null = null) {
 //   switch (type) {
 //     case ErrorhandlerService.ToastrType.Error:
 //       return this.toastr.error(message);
 //     case ErrorhandlerService.ToastrType.Warning:
 //       return this.toastr.warning(message);
 //     case ErrorhandlerService.ToastrType.Info:
 //       return this.toastr.info(message);
 //     case ErrorhandlerService.ToastrType.Show:
 //       return this.toastr.show(message);
 //     default:
 //       return this.toastr.success(message);
 //   }
 // }
}


export namespace ErrorhandlerService {
  /**
   * @summary The types of toastr:s available for show
   * @values Error, Warning, Info, Show, Success
   */
  export enum ToastrType {
    Error,
    Warning,
    Info,
    Show,
    Success
  }
}
