// src/app/comments/comment.ts
export class Comment {
    constructor(
        public user: string,
        public uid: string,
        public picture: string,
        public text: string,
        public timestamp: number
    ) {
    }

    // Workaround because Firestore won't accept class instances
    // as data when adding documents; must unwrap instance to save.
    // See: https://github.com/firebase/firebase-js-sdk/issues/311
    public get getObj(): Comment {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result as Comment;
    }

}
