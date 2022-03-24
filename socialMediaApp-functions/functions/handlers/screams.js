import { db } from '../util/admin.js';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit } from "firebase/firestore";
import { validateScream } from '../util/validators.js';

// get all the screams
export const getAllScreams = async (req, res) => {
    let screams = [];
    try{
        const querySnapshot = await getDocs(query(collection(db, "screams"), orderBy('createdAt', 'desc')));
        querySnapshot.forEach((doc) => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        res.json(screams);
    }
    catch(error){
        res.status(500).json({erorr: error.message});
        console.error(error);
    }
}

// post one scream
export const postOneScream = async (req, res) => {
    const {valid, errors} = validateScream(req.body);
    if(!valid) return errors.msg;

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    try{
        const doc = await addDoc(collection(db, "screams"), newScream);
        const resScream = newScream;
        resScream.screamId = doc.id;
        res.json(resScream);
    }
    catch(error){
        res.status(500).json({erorr: error.message});
        console.error(error);
    }
};

//fetch one scream
export const getScream = async (req, res) =>  {
    let screamData = {};
    try{
        const docRef = await getDoc(doc(db, "screams", req.params.screamId));
        if(!docRef.exists()){
            return res.status(404).json({error: 'Scream not found'});
        }
    
        screamData = docRef.data();
        screamData.screamId = docRef.id;
        const data = await getDocs(query(collection(db, "comments"), where('screamId', '==', req.params.screamId), orderBy('createdAt', 'desc')));
        screamData.comments = [];
        data.forEach(doc => {
            screamData.comments.push(doc.data());
        });
        return res.json(screamData);   
    } catch(err){
        console.log(err);
        return res.status(500).json({error: err.code});
    }
};

// Add a comment for a scream
export const commentOnScream = async (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({error: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    }

    try{
        const docRef = await getDoc(doc(db, "screams", req.params.screamId));
        if(!docRef.exists()){
            return res.status(404).json({error: 'Scream not found'});
        }

        await updateDoc(docRef.ref, { commentCount: docRef.data().commentCount + 1 });
    
        await addDoc(collection(db, "comments"), newComment);
        return res.json(newComment);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
};

// like a scream
export const likeScream = async (req, res) => {
    try{
        const likeDoc = await getDocs(query(collection(db, "likes"), where('userHandle', '==', req.user.handle), where('screamId', '==', req.params.screamId), limit(1)));

        const screamDoc = doc(db, "screams", req.params.screamId);
    
        let screamData;
    
        const screamRef = await getDoc(screamDoc);
        if(screamRef.exists()){
            screamData = screamRef.data();
            screamData.screamId = screamRef.id;
    
            if(likeDoc.empty){
                await addDoc(collection(db, "likes"), {
                    screamId: req.params.screamId,
                    userHandle: req.user.handle
                });
    
                screamData.likeCount++;
    
                await updateDoc(screamDoc, { likeCount: screamData.likeCount });
                return res.json(screamData);
            }
            else{
                return res.status(400).json({error: 'Scream already liked'});
            }
        }
        else{
            res.status(404).json({error: 'Scream not found'});
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({error: err.code});
    }
};

// unlike a scream
export const unlikeScream = async (req, res) => {
    try{
        const likeDoc = await getDocs(query(collection(db, "likes"), where('userHandle', '==', req.user.handle), where('screamId', '==', req.params.screamId), limit(1)));

        const screamDoc = doc(db, "screams", req.params.screamId);
    
        let screamData;
    
        const screamRef = await getDoc(screamDoc);
        if(screamRef.exists()){
            screamData = screamRef.data();
            screamData.screamId = screamRef.id;
    
            if(likeDoc.empty){
                return res.status(400).json({error: 'Scream already liked'});
            }
            else{
                console.log(likeDoc.docs[0].id);
                await deleteDoc(doc(db, "likes", likeDoc.docs[0].id));
                screamData.likeCount--;
                await updateDoc(screamDoc, { likeCount: screamData.likeCount });
                return res.json(screamData);
            }
        }
        else{
            res.status(404).json({error: 'Scream not found'});
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({error: err.code});
    }
}
