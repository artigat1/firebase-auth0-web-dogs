// src/environments/environment.ts
const FB_PROJECT_ID = 'dogs-steve';

export const environment = {
    production: false,
    auth: {
        clientId: 'lHYOPX4la7rB2N2nuYkulhXti9jL9GLQ',
        clientDomain: 'mporium-dev.eu.auth0.com', // e.g., you.auth0.com
        audience: 'http://localhost:1337/', // e.g., http://localhost:1337/
        redirect: 'http://localhost:4200/callback',
        scope: 'openid profile email'
    },
    firebase: {
        apiKey: 'AIzaSyBxdhtbv_RPWKnEgHmVDU96kImw39tWv5w',
        authDomain: `${FB_PROJECT_ID}.firebaseapp.com`,
        databaseURL: `https://${FB_PROJECT_ID}.firebaseio.com`,
        projectId: FB_PROJECT_ID,
        storageBucket: `${FB_PROJECT_ID}.appspot.com`,
        messagingSenderId: '266089223406'
    },
    apiRoot: 'http://localhost:1337/' // e.g., http://localhost:1337/ (DO include trailing slash)
};
