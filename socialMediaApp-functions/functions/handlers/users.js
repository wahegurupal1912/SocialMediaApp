
import { db, admin } from '../util/admin.js';
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
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
                    return res.status(500).json({erorr: error.message});
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
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({general: 'Wrong Credentials, please try again'})
        } else{
            return res.status(500).json({error: err.code});
        }
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