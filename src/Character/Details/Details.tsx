import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import { Character } from '../Character.types.ts';
import { fetchCharacter } from '../fetchCharacter.ts';

const Details = () => {
  const { characterId } = useParams();

  const [character, setCharacter] = React.useState<Character | null>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  useEffect(() => {
    console.log('re-rendered');
    const controller = new AbortController();
    const loadCharacter = async (characterId: string) => {
      const signal = controller.signal;
      const response = await fetchCharacter(characterId, signal);
      setCharacter(response.data?.results[0]);
    };

    if (characterId) {
      try {
        setIsLoading(true);
        loadCharacter(characterId);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    return () => {
      console.log('cleanup');
      controller.abort();
    }

  }, [characterId, setCharacter, setIsError, setIsLoading]);

  return (
    <>
      {isError && <Alert severity="error">Error when displaying character</Alert>}
      <Card>
        {isLoading && <LinearProgress color="secondary" />}
        <CardHeader
          title={character?.name}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            marginBottom: '1em'
          }}
        ></CardHeader>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <CardMedia
                component="img"
                image={`${character?.thumbnail.path}.${character?.thumbnail.extension}`}
                alt={character?.name}
                sx={{ width: '25%' }}
              ></CardMedia>
              <Typography paddingLeft="2em" paragraph={true} component="div">
                {character?.description || 'No description available'}
              </Typography>
            </Box>
            <Stack direction="row" justifyContent="flex-end">
              <Typography component="i" sx={{ fontSize: '0.75rem' }}>
                function component
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Details;
