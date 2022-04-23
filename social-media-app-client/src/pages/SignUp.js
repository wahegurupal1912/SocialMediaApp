/** @jsxRuntime classic */
/** @jsx jsx */
import { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import appIcon from '../images/icon.png';
import { Link, useNavigate } from 'react-router-dom';

// MUI Elements
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = {
  form: css({
    textAlign: 'center'
  }),
  image: css({
    margin: '20px auto 20px auto'
  }),
  pageTitle: css({
    margin: '10px auto 10px auto'
  }),
  textField: css({
    margin: '10px auto 10px auto'
  }),
  button: css({
    marginTop: '20px',
    position: 'relative'
  }),
  customError: css({
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '10px'
  }),
  progress: {
    position: 'absolute'
  }
};

const SignUp = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const {UI: { loading }} = props;

  useEffect(() => {
    setErrors(props.UI.errors);
  }, [props.UI.errors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUserData = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      handle: handle
    };
    props.signupUser(newUserData, navigate);
  };
  
  const handleChange = (event) => {
    switch(event.target.name){
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(event.target.value);
        break;
      case 'handle':
        setHandle(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <Grid container css={styles.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={appIcon} alt='App Icon' css={styles.image}/>
        <Typography variant='h2' css={styles.pageTitle}>
          Sign Up
        </Typography>
        
        <form noValidate onSubmit={handleSubmit}>
          <TextField variant='standard' id='email' name='email' type='email' label='Email' css={styles.textField}
            helperText={errors.email} error={errors.email ? true : false} value={email} onChange={handleChange} fullWidth/>
          
          <TextField variant='standard' id='password' name='password' type='password' label='Password' css={styles.textField}
            helperText={errors.password} error={errors.password ? true : false} value={password} onChange={handleChange} fullWidth/>

          <TextField variant='standard' id='confirmPassword' name='confirmPassword'type='password' label='Confirm Password' css={styles.textField}
            helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false} value={confirmPassword} onChange={handleChange} fullWidth />

          <TextField variant='standard' id='handle' name='handle'type='text' label='Handle' css={styles.textField}
            helperText={errors.handle} error={errors.handle ? true : false} value={handle} onChange={handleChange} fullWidth />
          
          {errors.general && (
            <Typography variant='body2' css={styles.customError}>
              {errors.general}
            </Typography>
          )}
          
          <Button type='submit' variant='contained' color='primary' css={styles.button} disabled={loading}>
            Sign Up
            {loading && (
              <CircularProgress size={30} css={styles.progress}/>
            )}
            </Button>
          <br />
          <small>Already have an account? Login <Link to='/login'>here</Link></small>
        </form>
      
      </Grid>
      <Grid item sm />
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  signupUser
};

export default connect(mapStateToProps, mapActionsToProps)(SignUp);