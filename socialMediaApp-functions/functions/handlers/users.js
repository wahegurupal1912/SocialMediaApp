
import { db, admin } from '../util/admin.js';
import { getDoc, getDocs, setDoc, updateDoc, doc, collection, writeBatch, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { validateSignUpData, validateLoginData, reduceUserDetails } from '../util/validators.js';
import { firebaseConfig } from '../util/config.js';

import busboy from 'busboy';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Sign up user
export const signup = async (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const {valid, errors } = validateSignUpData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    try{
        let userId;

        const docRef = await getDoc(doc(db, "users", newUser.handle));
        if (docRef.exists()) {
            res.status(400).json({handle: 'this handle is already taken'});
        } else {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            .then(data => {
                userId = data.user.uid
                return data.user.getIdToken();
            })
            .then(async (token) => {
                const userCredential = {
                    handle: newUser.handle,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                    userId: userId
                };
                const userRef = await setDoc(doc(db, "users", newUser.handle), userCredential);
                return res.status(201).json({ token });
            })
            .catch((error) => {
                console.error(error);
                if(error.code === 'auth/email-already-in-use'){
                    return res.status(400).json({email: 'Email already in use'});
                } else{
                    return res.status(500).json({general: 'Something went wrong, please try again'});
                }
            });
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({erorr: error.message});
    }    
};

// Log user in
export const login = async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const {valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
    .then (data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        // auth/wrong-password
        // auth/user-not-found
        return res.status(403).json({general: 'Wrong Credentials, please try again'});
    });
};

// Add user details
export const addUserDetails = async (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    try{
        const userRef = doc(db, "users", req.user.handle);
        await updateDoc(userRef, userDetails);
        return res.json({message: 'Details added successfully'});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({error: err.code});
    }
};

// Get any users details
export const getUserDetails = async (req, res) => {
    let userData = {};
    try{
        const user = await getDoc(doc(db, "users", req.params.handle));

        if(user.exists()){
            userData.user = user.data();
    
            const screams = await getDocs(query(collection(db, "screams"), where('userHandle', '==', req.params.handle), orderBy('createdAt', 'desc')));
            userData.screams = [];
            screams.forEach(scream => {
                userData.screams.push({
                    body: scream.data().body,
                    createdAt: scream.data().createdAt,
                    userHandle: scream.data().userHandle,
                    userImage: scream.data().userImage,
                    likeCount: scream.data().likeCount,
                    commentCount: scream.data().commentCount,
                    screamId: scream.id,
                });
            });
            return res.json(userData);
        } else{
            return res.status(404).json({error: 'User not found'});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({error: err.code});
    }
};

// mark the notificaitons read for the user
export const markNotificationsRead = (req, res) => {
    let batch = writeBatch(db);
    req.body.forEach(notificationId => {
        const notificaiton = doc(db, "notifications", notificationId);
        batch.update(notificaiton, {read: true});
    })

    batch.commit()
    .then(() => {
        return res.json({message: 'Notificaitons marked read'});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err.code});
    });
};

// Get full user details
export const getAuthenticatedUser = async (req, res) => {
    let userData = {};
    try{
        const docRef = await getDoc(doc(db, "users", req.user.handle));
        if(docRef.exists()){
            userData.credentials = docRef.data();
            const data = await getDocs(query(collection(db, "likes"), where('userHandle', '==', req.user.handle)));
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });

            userData.notifications = [];
            const notifications = await getDocs(query(collection(db, "notifications"), where('recipient', '==', req.user.handle), orderBy('createdAt', 'desc'), limit(10)));

            notifications.forEach(notification => {
                userData.notifications.push({
                    recipient: notification.data().recipient,
                    sender: notification.data().sender,
                    createdAt: notification.data().createdAt,
                    screamId: notification.data().screamId,
                    type: notification.data().type,
                    read: notification.data().read,
                    notificationId: notification.id
                });
            })

            return res.json(userData);
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({error: err.code});
    }
};

// Upload a profile image for user
export const uploadImage = (req, res) => {
    const bb = busboy({ headers: req.headers });
    
    let imageFileName;
    let imageToBeUploaded = {};

    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(filename.mimetype !== 'image/jpeg' && filename.mimetype !== 'image/png') {
            return res.status(400).json({error: 'Wrong file type submitted'});
        }

        const name = filename.filename;
        const imageExtension = name.split('.')[name.split('.').length - 1];
        
        // randomValue.extension
        imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype: filename.mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });

    bb.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(async () => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            const userRef = doc(db, "users", req.user.handle);
            await updateDoc(userRef, { imageUrl });
            return res.json({message: 'Image uploaded succesfully'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
    });

    bb.end(req.rawBody);
};