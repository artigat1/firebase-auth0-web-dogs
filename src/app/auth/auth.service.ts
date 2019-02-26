import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { of, Subscription, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    accessToken: string;
    userProfile: any;
    // Track authentication status
    loggedIn: boolean;
    loading: boolean;
    // Track Firebase authentication status
    loggedInFirebase: boolean;
    // Subscribe to the Firebase token stream
    firebaseSub: Subscription;
    // Subscribe to Firebase renewal timer stream
    refreshFirebaseSub: Subscription;

    // Create Auth0 web auth instance
    private auth0 = new auth0.WebAuth({
        clientID: environment.auth.clientId,
        domain: environment.auth.clientDomain,
        responseType: 'token',
        redirectUri: environment.auth.redirect,
        audience: environment.auth.audience,
        scope: environment.auth.scope
    });

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private http: HttpClient
    ) {
    }

    get tokenValid(): boolean {
        // Check if current time is past access token's expiration
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return Date.now() < expiresAt;
    }

    login(redirect?: string) {
        // Set redirect after login
        const shouldRedirect = redirect ? redirect : this.router.url;
        localStorage.setItem('auth_redirect', shouldRedirect);
        // Auth0 authorize request
        this.auth0.authorize();
    }

    handleLoginCallback() {
        this.loading = true;
        // When Auth0 hash parsed, get profile
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken) {
                window.location.hash = '';
                // Store access token
                this.accessToken = authResult.accessToken;
                // Get user info: set up session, get Firebase token
                this.getUserInfo(authResult);
            } else if (err) {
                this.router.navigate(['/']);
                this.loading = false;
                console.error(`Error authenticating: ${ err.error }`);
            }
        });
    }

    getUserInfo(authResult) {
        // Use access token to retrieve user's profile and set session
        this.auth0.client.userInfo(this.accessToken, (err, profile) => {
            if (profile) {
                this.setSession(authResult, profile);
            } else if (err) {
                console.warn(`Error retrieving profile: ${ err.error }`);
            }
        });
    }

    scheduleFirebaseRenewal() {
        // If user isn't authenticated, check for Firebase subscription
        // and unsubscribe, then return (don't schedule renewal)
        if (!this.loggedInFirebase) {
            if (this.firebaseSub) {
                this.firebaseSub.unsubscribe();
            }
            return;
        }
        // Unsubscribe from previous expiration observable
        this.unscheduleFirebaseRenewal();
        // Create and subscribe to expiration observable
        // Custom Firebase tokens minted by Firebase
        // expire after 3600 seconds (1 hour)
        const expiresAt = new Date().getTime() + (3600 * 1000);
        const expiresIn$ = of(expiresAt)
            .pipe(
                mergeMap(
                    expires => {
                        const now = Date.now();
                        // Use timer to track delay until expiration
                        // to run the refresh at the proper time
                        return timer(Math.max(1, expires - now));
                    }
                )
            );

        this.refreshFirebaseSub = expiresIn$
            .subscribe(
                () => {
                    console.log('Firebase token expired; fetching a new one');
                    this.getFirebaseToken();
                }
            );
    }

    unscheduleFirebaseRenewal() {
        if (this.refreshFirebaseSub) {
            this.refreshFirebaseSub.unsubscribe();
        }
    }

    logout() {
        // Ensure all auth items removed
        localStorage.removeItem('expires_at');
        localStorage.removeItem('auth_redirect');
        this.accessToken = undefined;
        this.userProfile = undefined;
        this.loggedIn = false;
        // Sign out of Firebase
        this.loggedInFirebase = false;
        this.afAuth.auth.signOut();
        // Return to homepage
        this.router.navigate(['/']);
    }

    private setSession(authResult, profile) {
        // Set tokens and expiration in localStorage
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
        localStorage.setItem('expires_at', expiresAt);
        this.userProfile = profile;
        // Session set; set loggedIn and loading
        this.loggedIn = true;
        this.loading = false;
        // Get Firebase token
        this.getFirebaseToken();
        // Redirect to desired route
        this.router.navigateByUrl(localStorage.getItem('auth_redirect'));
    }

    private getFirebaseToken() {
        // Prompt for login if no access token
        if (!this.accessToken) {
            this.login();
        }
        const getToken$ = () => {
            return this.http
                .get(`${ environment.apiRoot }auth/firebase`, {
                    headers: new HttpHeaders().set('Authorization', `Bearer ${ this.accessToken }`)
                });
        };
        this.firebaseSub = getToken$().subscribe(
            res => this.firebaseAuth(res),
            err => console.error(`An error occurred fetching Firebase token: ${ err.message }`)
        );
    }

    private firebaseAuth(tokenObj) {
        this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
            .then(res => {
                this.loggedInFirebase = true;
                // Schedule token renewal
                this.scheduleFirebaseRenewal();
                console.log('Successfully authenticated with Firebase!');
            })
            .catch(err => {
                const errorCode = err.code;
                const errorMessage = err.message;
                console.error(`${ errorCode } Could not log into Firebase: ${ errorMessage }`);
                this.loggedInFirebase = false;
            });
    }

}
