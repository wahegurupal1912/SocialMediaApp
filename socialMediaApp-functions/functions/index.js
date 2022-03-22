import functions from 'firebase-functions';
import express from 'express';
import fbAuth from './util/fbAuth.js';
import { getAllScreams, postOneScream, getScream } from './handlers/screams.js';
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
// TODO: delete scream
// TODO: like a scream
// TODO: unlike a scream
// TODO: comment on scream

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);


//change region to canada to reduce latency
export const api = functions.region('northamerica-northeast1').https.onRequest(app);