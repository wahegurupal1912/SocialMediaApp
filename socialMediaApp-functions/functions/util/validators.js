const isEmpty = string => string.trim() === '';

const isEmail = (email) => {
    //email regex
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regex)) return true;
    else return false;
};

export const validateSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = 'Must not be empty';
    } else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address';
    }

    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(data.handle)) errors.handle = 'Must not be emapty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true: false
    };
};

export const validateLoginData = (data) => {
    let errors = {};
    
    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true: false
    };
};

export const validateScream = (data) => {
    let errors = {};
    
    if(isEmpty(data.body)) errors.msg = 'Body must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true: false
    };
};

export const reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

    if(!isEmpty(data.website.trim())){
        if(data.website.trim().substring(0, 4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }

    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};