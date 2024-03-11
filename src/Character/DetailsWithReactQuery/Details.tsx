import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
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
import { useQuery, useQueryClient } from 'react-query';
import { useCallback } from 'react';

const Details = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const controller = new AbortController();
  const signal = controller.signal;

  const { data, isLoading, isError, refetch, remove } = useQuery(
    ['character', characterId],
    () => fetchCharacter(characterId as string, signal),
    {
      enabled: !!characterId
    }
  );

  const character: Character = data?.data?.results[0];

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const invalidateQuery = useCallback(() => {
    console.log('invalidateQuery');
    queryClient.invalidateQueries(['character', characterId]);
  }, [queryClient, characterId]);

  const refetchQuery = useCallback(async () => {
    console.log('refetchQuery');
    await refetch();
  }, [refetch]);

  const removeQuery = useCallback(async () => {
    console.log('removeQuery');
    await remove();
  }, [remove]);

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
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                marginTop: '1em'
              }}
            >
              <Stack direction="row" justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={() => goBack()}
                  sx={{
                    marginRight: '1em'
                  }}
                >
                  Go back
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => invalidateQuery()}
                  sx={{
                    marginRight: '1em'
                  }}
                >
                  Invalidate query
                </Button>
                <Button
                  variant="contained"
                  onClick={() => refetchQuery()}
                  sx={{
                    marginRight: '1em'
                  }}
                >
                  Refetch query
                </Button>
                <Button variant="contained" onClick={() => removeQuery()}>
                  Remove query
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <Typography component="i" sx={{ fontSize: '0.75rem' }}>
                function component - react query
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Details;
