import { BrowserRouter as Router } from 'react-router-dom';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Trombi from './Trombi';

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
        <AppBar position="static">
          <Toolbar
            sx={{
              minHeight: 100
            }}
          >
            <img
              src="/images/marvel_logo.png"
              alt="Marvel Logo"
              style={{
                minHeight: '100%',
                maxWidth: 100
              }}
            />
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
              <Trombi />
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
