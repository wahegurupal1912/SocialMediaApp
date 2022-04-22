import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import customTheme from './utils/theme';
import jwtDecode from 'jwt-decode';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Components
import NavBar from './components/NavBar';
import AuthRoute from './utils/AuthRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const theme = createTheme(customTheme);

let authenticated;
const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);

  if(decodedToken.exp * 1000 < Date.now()){
    // window.location.href = '/login';
    authenticated = false;
  }
  else{
    authenticated = true;
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

                  <Route exact path='/login' element={<AuthRoute authenticated={authenticated} />}>
                    <Route exact path='/login' element={<Login/>}/>
                  </Route>

                  <Route exact path='/signup' element={<AuthRoute authenticated={authenticated} />}>
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