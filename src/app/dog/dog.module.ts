import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DogComponent } from './dog/dog.component';
import { CoreModule } from '../core/core.module';

const DOG_ROUTES: Routes = [
    {
        path: ':rank',
        component: DogComponent
    }
];

@NgModule({
    declarations: [
        DogComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(DOG_ROUTES)
    ]
})
export class DogModule {
}
