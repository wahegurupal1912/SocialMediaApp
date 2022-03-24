import functions from 'firebase-functions';
import express from 'express';
import fbAuth from './util/fbAuth.js';
import { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream } from './handlers/screams.js';
import { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } from './handlers/users.js';

/*
status codes
200 - Success
201 - resource created
400 - Bad Request - user error(frontend)
403 - Unauthorized access
500 - server error
*/

const app = express(); //initialize express for routing

// Scream Routes
app.get('/screams', getAllScreams);
app.post('/scream', fbAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', fbAuth, commentOnScream);
app.get('/scream/:screamId/like', fbAuth, likeScream);
app.get('/scream/:screamId/unlike', fbAuth, unlikeScream);
// TODO: delete scream

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);


//change region to canada to reduce latency
export const api = functions.region('northamerica-northeast1').https.onRequest(app);