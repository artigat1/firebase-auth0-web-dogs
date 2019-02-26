// src/app/dog/dog/dog.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { ApiService } from '../../core/api.service';
import { DogDetail } from '../../core/dog-detail';

@Component({
    selector: 'app-dog',
    templateUrl: './dog.component.html',
    styleUrls: ['./dog.component.scss']
})
export class DogComponent implements OnInit, OnDestroy {
    dog$: Observable<DogDetail>;
    loading = true;
    error: boolean;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private title: Title
    ) {
    }

    ngOnInit() {
        this.route.params
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(
                params => {
                    this.dog$ = this.api
                        .getDogByRank$(params.rank)
                        .pipe(
                            tap(val => this.onNext(val)),
                            catchError((err, caught) => this.onError(err, caught))
                        );
                }
            );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getPageTitle(dog: DogDetail): string {
        const pageTitle = `#${ dog.rank }: ${ dog.breed }`;
        this.title.setTitle(pageTitle);
        return pageTitle;
    }

    getImgStyle(url: string) {
        return `url(${ url })`;
    }

    private onNext(val: DogDetail) {
        this.loading = false;
    }

    private onError(err, caught): Observable<any> {
        this.loading = false;
        this.error = true;
        return throwError('An error occurred fetching detail data for this dog.');
    }

}
