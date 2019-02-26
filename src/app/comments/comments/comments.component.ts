// src/app/comments/comments/comments.component.ts
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Comment } from '../comment';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
    comments$: Observable<Comment[]>;
    loading = true;
    error: boolean;
    private commentsCollection: AngularFirestoreCollection<Comment>;

    constructor(
        private afs: AngularFirestore,
        public auth: AuthService
    ) {
    }

    ngOnInit(): void {
        // Get latest 15 comments from Firestore, ordered by timestamp
        this.commentsCollection = this.afs
            .collection<Comment>(
                'comments',
                ref => ref.orderBy('timestamp').limit(15)
            );
        // Set up observable of comments
        this.comments$ = this.commentsCollection
            .snapshotChanges()
            .pipe(
                map(res => this.onNext(res)),
                catchError((err, caught) => this.onError(err, caught))
            );
    }

    async onPostComment(comment: Comment) {
        // Unwrap the Comment instance to an object for Firestore
        // See https://github.com/firebase/firebase-js-sdk/issues/311
        const commentObj: Comment = comment.getObj;
        await this.commentsCollection.add(commentObj);
    }

    canDeleteComment(uid: string): boolean {
        if (!this.auth.loggedInFirebase || !this.auth.userProfile) {
            return false;
        }
        return uid === this.auth.userProfile.sub;
    }

    async deleteComment(id: string) {
        // Delete comment with confirmation prompt first
        if (window.confirm('Are you sure you want to delete your comment?')) {
            const thisDoc: AngularFirestoreDocument<Comment> = this.afs.doc<Comment>(`comments/${ id }`);
            await thisDoc.delete();
        }
    }

    private onNext(res) {
        this.loading = false;
        this.error = false;
        // Add Firestore ID to comments
        // The ID is necessary to delete specific comments
        return res.map(action => {
            const data = action.payload.doc.data() as Comment;
            const id = action.payload.doc.id;
            return { id, ...data };
        });
    }

    private onError(err, caught): Observable<any> {
        this.loading = false;
        this.error = true;
        return throwError('An error occurred while retrieving comments.');
    }

}
