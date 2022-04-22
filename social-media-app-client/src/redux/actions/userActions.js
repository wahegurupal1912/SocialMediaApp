import axios from "axios";
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";

export const loginUser = (userData, navigate) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
    .then(res => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem('FBIdToken', FBIdToken);
      axios.defaults.headers.common['Authorization'] = FBIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
    //   setLoading(false);
      navigate('/');
    })
    .catch(err => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        });
    });
}

export const getUserData = () => (dispatch) => {
    axios.get('/user')
    .then(res => {
        dispatch({
            type: SET_USER,
            payload: res.data
        })
    })
    .catch(err => {
        console.log(err);
    })
}