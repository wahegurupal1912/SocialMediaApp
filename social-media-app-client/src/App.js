import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import customTheme from './utils/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import NavBar from './components/NavBar';
import AuthRoute from './utils/AuthRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const theme = createTheme(customTheme);

const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);

  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
    // window.location.href = '/login';
  }
  else{
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    store.dispatch(getUserData());
  }
}

const App = () => {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
              <NavBar />
              <div className='container'>
                <Routes>
                  <Route exact path='/' element={<Home/>}/>

                  <Route exact path='/login' element={<AuthRoute />}>
                    <Route exact path='/login' element={<Login/>}/>
                  </Route>

                  <Route exact path='/signup' element={<AuthRoute />}>
                    <Route exact path='/signup' element={<SignUp/>}/>
                  </Route>
                </Routes>
              </div>
            </Router>
        </Provider>
      </ThemeProvider>
    )
};

export default App;