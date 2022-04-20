import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import Scream from '../components/Scream';

// MUI Elements
import Grid from '@mui/material/Grid';

const Home = () => {

  const [screams, setScreams] = useState(null);

  useEffect(() => {
    axios.get('/screams')
      .then(res => {
        setScreams(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  let recentScreamsMarup = screams ? (
    screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
  ) : <p>Loading...</p>

  return (
    <Grid container spacing={8}>
      <Grid item sm={8} xs={12}>
        {recentScreamsMarup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile</p>
      </Grid>
    </Grid>
  )
}

export default Home;