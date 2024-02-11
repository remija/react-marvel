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
import { Character } from '../Trombi.types.ts';
import { ThumbDown, ThumbUp } from '@mui/icons-material';
import React from 'react';

export type CharacterProps = Character;
const CharacterCard = ({ name, thumbnail }: CharacterProps) => {
  const [rating, setRating] = React.useState(0);

  return (
    <Grid item component={Card} xs={12} md={3}>
      <CardMedia
        sx={{
          height: '10em'
        }}
        image={`${thumbnail.path}.${thumbnail.extension}`}
        title={`${name} thumbnail`}
      />
      <CardContent>
        <Typography gutterBottom component="h5">
          {name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              setRating(rating + 1);
            }}
          >
            <ThumbUp />
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setRating(rating - 1);
            }}
          >
            <ThumbDown />
          </Button>
          <Rating max={3} value={rating} />
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Typography component="i" sx={{ fontSize: '0.75rem' }}>
            function component
          </Typography>
        </Stack>
      </CardContent>
    </Grid>
  );
};

export default CharacterCard;
