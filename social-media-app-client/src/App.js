import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Components
import NavBar from './components/NavBar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const theme = createTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  },
  typography: {
    useNextVariants: true
  }
});

const App = () => {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
            <div className='container'>
              <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/signup" element={ <SignUp /> } />
              </Routes>
            </div>
          </Router>
        </div>
      </ThemeProvider>
    )
};

export default App;