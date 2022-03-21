import { db } from '../util/admin.js';
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
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