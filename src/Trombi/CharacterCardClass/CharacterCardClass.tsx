import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Stack,
  Typography
} from '@mui/material';
import { CharacterProps } from '../CharacterCard/CharacterCard.tsx';
import { ThumbDown, ThumbUp } from '@mui/icons-material';

type CharacterState = {
  rating: number;
};

class CharacterCardClass extends React.Component<CharacterProps, CharacterState> {
  state: CharacterState = {
    rating: 0
  };

  constructor(props: CharacterProps) {
    super(props);
  }

  increaseRating = () => {
    this.setState({ rating: this.state.rating + 1 });
  };

  decreaseRating = () => {
    this.setState({ rating: this.state.rating - 1 });
  };

  render() {
    return (
      <Grid item component={Card} xs={12} md={3}>
        <CardMedia
          sx={{
            height: '10em'
          }}
          image={`${this.props.thumbnail.path}.${this.props.thumbnail.extension}`}
          title={`${this.props.name} thumbnail`}
        />
        <CardContent>
          <Typography gutterBottom component="h5">
            {this.props.name}
          </Typography>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button variant="contained" onClick={this.increaseRating}>
              <ThumbUp />
            </Button>
            <Button variant="outlined" onClick={this.decreaseRating}>
              <ThumbDown />
            </Button>
            <Rating max={3} value={this.state.rating} />
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Typography component="i" sx={{ fontSize: '0.75rem' }}>
              class component
            </Typography>
          </Stack>
        </CardContent>
      </Grid>
    );
  }
}

export default CharacterCardClass;
