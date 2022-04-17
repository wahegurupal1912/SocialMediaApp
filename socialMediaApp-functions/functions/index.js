import functions from 'firebase-functions';
import express from 'express';
import fbAuth from './util/fbAuth.js';
import { db } from './util/admin.js';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch, where, query } from "firebase/firestore";
import { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } from './handlers/screams.js';
import { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } from './handlers/users.js';

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
app.delete('/scream/:screamId', fbAuth, deleteScream);
app.post('/scream/:screamId/comment', fbAuth, commentOnScream);
app.get('/scream/:screamId/like', fbAuth, likeScream);
app.get('/scream/:screamId/unlike', fbAuth, unlikeScream);

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', fbAuth, markNotificationsRead);


//change region to canada to reduce latency
export const api = functions.region('northamerica-northeast1').https.onRequest(app);

export const createNotificationOnLike = functions.region('northamerica-northeast1').firestore.document('likes/{id}')
    .onCreate(async (snapshot) => {
        try{
            const screamRef = await getDoc(doc(db, "screams", snapshot.data().screamId));
            if(screamRef.exists() && (screamRef.data().userHandle != snapshot.data().userHandle)){
                await setDoc(doc(db, "notifications", snapshot.id), {
                    createdAt: new Date().toISOString(),
                    recipient: screamRef.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    screamId: screamRef.id
                });
            }
        } catch(err){
            console.error(err);
            return;
        }
    });

export const deleteNotificaionOnUnlike = functions.region('northamerica-northeast1').firestore.document('likes/{id}')
    .onDelete(async (snapshot) => {
        try{
            await deleteDoc(doc(db, "notifications", snapshot.id));
            return;
        } catch(err){
            console.error(err);
            return;
        }
    });

export const createNotificationOnComment = functions.region('northamerica-northeast1').firestore.document('comments/{id}')
    .onCreate(async (snapshot) => {
        try{
            const screamRef = await getDoc(doc(db, "screams", snapshot.data().screamId));
            if(screamRef.exists() && (screamRef.data().userHandle != snapshot.data().userHandle)){
                await setDoc(doc(db, "notifications", snapshot.id), {
                    createdAt: new Date().toISOString(),
                    recipient: screamRef.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    screamId: screamRef.id
                });
    
            }
        } catch(err){
            console.error(err);
            return;
        }
    });

export const onUserImageChange = functions.region('northamerica-northeast1').firestore.document('/users/{userId}')
    .onUpdate(async (change) => {
        try{
            if(change.before.data().imageUrl != change.after.data().imageUrl){
                const batch = writeBatch(db);

                const data = await getDocs(query(collection(db, "screams"), where('userHandle', '==', change.before.data().handle)));
                data.forEach(screamRef => {
                    const scream = doc(db, "screams", screamRef.id);
                    batch.update(scream, {userImage: change.after.data().imageUrl});
                });
        
                batch.commit();   
            }
        } catch(err){
            console.error(err);
        }
    });

export const onScreamDelete = functions.region('northamerica-northeast1').firestore.document('/screams/{screamId}')
    .onDelete(async (snapshot, context) => {
        try{ 
            const screamId = context.params.screamId;
            const batch = writeBatch(db);
    
            const comments = await getDocs(query(collection(db, "comments"), where('screamId', '==', screamId)));
            comments.forEach(comment => {
                batch.delete(doc(db, "comments", comment.id));
            });
    
            const likes = await getDocs(query(collection(db, "likes"), where('screamId', '==', screamId)));
            likes.forEach(like => {
                batch.delete(doc(db, "likes", like.id));
            });
    
            const notifications = await getDocs(query(collection(db, "notifications"), where('screamId', '==', screamId)));
            notifications.forEach(notification => {
                batch.delete(doc(db, "notifications", notification.id));
            });
    
            batch.commit();
        } catch(err){
            console.error(err);
        }

    });
