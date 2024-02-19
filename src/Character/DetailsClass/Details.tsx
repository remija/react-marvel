import React from 'react';
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
import { fetchCharacter } from '../fetchCharacter.ts';
import { Character } from '../Character.types.ts';

function withParams(Component: React.ComponentType<DetailsProps>) {
  return (props: DetailsProps) => <Component {...props} params={useParams()} />;
}

type DetailsProps = {
  params?: {
    characterId?: string;
  };
};

type DetailsState = {
  character?: Character;
  isError: boolean;
  isLoading: boolean;
};

class Details extends React.Component<DetailsProps, DetailsState> {
  state: DetailsState = {
    character: undefined,
    isError: false,
    isLoading: false
  };
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const response = await fetchCharacter(this.props?.params?.characterId as string);
      if (response.data?.results?.length > 0) {
        this.setState({ character: response.data?.results[0] });
      }
    } catch (e) {
      console.error(e);
      this.setState({ isError: true });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps: DetailsProps) {
    console.log('re-rendered', prevProps, this.props);
  }

  render() {
    return (
      <>
        {this.state.isError && <Alert severity="error">Error when displaying character</Alert>}
        <Card>
          {this.state.isLoading && <LinearProgress color="secondary" />}
          <CardHeader
            title={this.state.character?.name}
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
                  image={`${this.state.character?.thumbnail.path}.${this.state.character?.thumbnail.extension}`}
                  alt={this.state.character?.name}
                  sx={{ width: '25%' }}
                ></CardMedia>
                <Typography paddingLeft="2em" variant="p" component="div">
                  {this.state.character?.description || 'No description available'}
                </Typography>
              </Box>
              <Stack direction="row" justifyContent="flex-end">
                <Typography component="i" sx={{ fontSize: '0.75rem' }}>
                  class component
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </>
    );
  }
}

export default withParams(Details);
