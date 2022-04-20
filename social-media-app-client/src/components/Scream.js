/** @jsxRuntime classic */
/** @jsx jsx */
import { Link } from 'react-router-dom';
import { css, jsx } from '@emotion/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// MUI Elements
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const styles = {
  card: css({
    display: 'flex',
    marginBottom: '20px'
  }),
  image: css({
    minWidth: '200px',
    objectFit: 'cover'
  }),
  content: css({
    padding: 25
  })
}

const Scream = (props) => {
  const { body, createdAt, userImage, userHandle, screamId, likeCount, commentCount } = props.scream;

  dayjs.extend(relativeTime);
  return (
    <Card css={styles.card}>
        <CardMedia
        css={styles.image}
        image={userImage}
        title='Profile Image'
        />

        <CardContent css={styles.content}>
            <Typography variant='h5' component={Link} to={`/users/${userHandle}`} color='primary'>{userHandle}</Typography>
            <Typography variant='body2' color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
            <Typography variant='body1'>{body}</Typography>
        </CardContent>
    </Card> 
  )
};

export default Scream;