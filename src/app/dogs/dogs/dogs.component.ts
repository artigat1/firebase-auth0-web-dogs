import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Dog } from '../../core/dog';
import { ApiService } from '../../core/api.service';

@Component({
    selector: 'app-dogs',
    templateUrl: './dogs.component.html'
})
export class DogsComponent implements OnInit {
    pageTitle = 'Popular Dogs';
    dogsList$: Observable<Dog[]>;
    loading = true;
    error: boolean;

    constructor(
        private title: Title,
        private api: ApiService
    ) {
    }

    ngOnInit() {
        this.title.setTitle(this.pageTitle);

        this.dogsList$ = this.api
            .getDogs$()
            .pipe(
                tap(val => this.onNext(val)),
                catchError((err, caught) => this.onError(err, caught))
            );
    }

    private onNext(val: Dog[]) {
        this.loading = false;
    }

    private onError(err, caught): Observable<any> {
        this.loading = false;
        this.error = true;
        return throwError('An error occurred fetching dogs data.');
    }

}
