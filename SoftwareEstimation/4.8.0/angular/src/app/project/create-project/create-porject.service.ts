import { Injector, Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

@Injectable()
export class CreateProjectService {
    constructor(
        private http: HttpClient
    ) { }
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened: bad input.');
    };
    Clonegit(username: string, title: string, link: string) {
        // var params= [{"username": username,
        //             "name": title,
        //             "url": link}]
        let body = new HttpParams()
            .set('username', username)
            .set('name', title)
            .set('url', link)

        console.log("clonegit body: ",body)

        return this.http.post("http://localhost:3000/api/CloneGit", body,
        {
            
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .append('Access-Control-Allow-Origin', 'http://localhost:3000')
                .append('Access-Control-Allow-Credentials', 'true')
                ,
                
        }).pipe(
            catchError(this.handleError),
        )
    }
}