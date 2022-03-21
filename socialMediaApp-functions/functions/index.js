import functions from 'firebase-functions';
import express from 'express';
import fbAuth from './util/fbAuth.js';
import { getAllScreams, postOneScream } from './handlers/screams.js';
import { signup, login, uploadImage, addUserDetails } from './handlers/users.js';

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

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);


//change region to canada to reduce latency
export const api = functions.region('northamerica-northeast1').https.onRequest(app);