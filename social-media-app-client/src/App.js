import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import NavBar from './components/NavBar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App = () => {
    return (
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
    )
}

export default App;