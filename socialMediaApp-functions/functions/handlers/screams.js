import { db } from '../util/admin.js';
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "firebase/firestore";
import { validateScream } from '../util/validators.js';

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

export const postOneScream = async (req, res) => {
    const {valid, errors} = validateScream(req.body);
    if(!valid) return errors.msg;

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    try{
        const doc = await addDoc(collection(db, "screams"), newScream);
        res.json({message: `document ${doc.id} created successfully`})
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
    
        const commentRef = await addDoc(collection(db, "comments"), newComment);
        return res.json(newComment);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}