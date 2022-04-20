/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from 'react';
import { css, jsx } from '@emotion/react';
import appIcon from '../images/icon.png';

// MUI Elements
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
    marginTop: '20px'
  })
};

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  
  const handleChange = (event) => {
    switch(event.target.name){
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
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
          Login
        </Typography>
        
        <form noValidate onSubmit={handleSubmit}>
          <TextField id='email' name='email' type='email' label='Email' css={styles.textField}
            value={email} onChange={handleChange} fullWidth/>
          <TextField id='password' name='password' type='password' label='Password' css={styles.textField}
            value={password} onChange={handleChange} fullWidth/>
          <Button type='submit' variant='contained' color='primary' css={styles.button}>Submit</Button>
        </form>
      
      </Grid>
      <Grid item sm />
    </Grid>
  )
}

export default Login;