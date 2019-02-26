import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '../core/core.module';

import { DogsComponent } from './dogs/dogs.component';
import { CommentsModule } from '../comments/comments.module';

const DOGS_ROUTES: Routes = [
    {
        path: '',
        component: DogsComponent
    }
];

@NgModule({
    declarations: [
        DogsComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(DOGS_ROUTES),
        CommentsModule
    ]
})
export class DogsModule {
}
