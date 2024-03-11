import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// import {ReactQueryDevtools} from "react-query-devtools";
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Trombi from './Trombi';
// import Details from './Character/Details';
import { default as Details } from './Character/DetailsWithReactQuery';
// import {default as DetailsClass} from "./Character/DetailsClass";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5
    }
  }
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#EC1D24'
    },
    secondary: {
      main: '#379590'
    }
  }
});

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppBar position="static">
            <Toolbar
              sx={{
                minHeight: 100
              }}
            >
              <Link to="/">
                <img
                  src="/images/marvel_logo.png"
                  alt="Marvel Logo"
                  style={{
                    minHeight: '100%',
                    maxWidth: 100
                  }}
                />
              </Link>
              <Typography
                variant="h3"
                sx={{
                  flexGrow: 1,
                  paddingLeft: '2%',
                  color: 'white'
                }}
              >
                Characters
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            style={{
              flexGrow: 1,
              padding: '10px'
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{
                marginTop: '2em'
              }}
            >
              <Grid item xs={6}>
                <Routes>
                  <Route path="/" element={<Trombi />} />
                  <Route path="/characters/:characterId" element={<Details />} />
                </Routes>
              </Grid>
            </Grid>
          </div>
          {/*<ReactQueryDevtools/>*/}
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
