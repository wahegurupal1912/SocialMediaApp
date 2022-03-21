import { db } from '../util/admin.js';
import { admin } from "./admin.js";
import { collection, getDocs, query, where, limit, doc } from "firebase/firestore";

const fbAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else{
        console.error('No token found');
        return res.status(403).json({error: 'Unauthorized Access'});
    }

    admin.auth().verifyIdToken(idToken)
    .then(async (decodedToken) => {
        req.user = decodedToken;
        const data = await getDocs(query(collection(db, "users"), where('userId', '==', req.user.uid), limit(1)));
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch((err) => {
        //if the token is expired, blacklisted, etc
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    });
};

export default fbAuth;