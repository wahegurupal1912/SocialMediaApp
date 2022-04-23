import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthRoute = (props) => {
  return props.authenticated ? <Navigate to='/' /> : <Outlet />;
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(AuthRoute);