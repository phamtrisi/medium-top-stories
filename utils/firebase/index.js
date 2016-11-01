var firebase = require('firebase');

function initFirebaseApp() {
    var app = firebase.initializeApp({
        apiKey: "AIzaSyBU7c7vX5xLsEdGwPI4B4XhjpswcGah2pE",
        authDomain: "medium-top-stories.firebaseapp.com",
        databaseURL: "https://medium-top-stories.firebaseio.com",
        storageBucket: "medium-top-stories.appspot.com",
        messagingSenderId: "285647035476"
    });

    return app;
}

module.exports = initFirebaseApp;