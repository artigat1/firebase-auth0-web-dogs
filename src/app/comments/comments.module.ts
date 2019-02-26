import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { CoreModule } from '../core/core.module';
import { environment } from '../../environments/environment';

import { CommentsComponent } from './comments/comments.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';

@NgModule({
    declarations: [
        CommentsComponent,
        CommentFormComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
    ],
    exports: [CommentsComponent]
})
export class CommentsModule {
}
