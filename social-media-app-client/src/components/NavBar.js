import React from 'react'
import { Link } from 'react-router-dom';

//MUI Elements
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

function NavBar() {
  return (
    <AppBar>
      <Toolbar className='nav-container'>
        <Button color='inherit' component={Link} to="/">Home</Button>
        <Button color='inherit' component={Link} to="/login">Login</Button>
        <Button color='inherit' component={Link} to="/signup">Sign Up</Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar