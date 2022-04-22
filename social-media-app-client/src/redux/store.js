import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

const preloadedState  = {};

const reducer = {
    user: userReducer,
    UI: uiReducer
};

const store = configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;