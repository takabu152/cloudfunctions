const functions = require('firebase-functions');

// http://localhost:5000/functions-284d0/us-central1/helloWorld
// https://us-central1-functions-284d0.cloudfunctions.net/helloWorld
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
