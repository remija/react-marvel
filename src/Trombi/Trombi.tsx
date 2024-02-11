import { CircularProgress, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import { TrombiProps } from './Trombi.types.ts';
import CharacterCard from './CharacterCard';
// import CharacterCardClass from './CharacterCardClass';

export const Trombi = ({
  characters,
  numberPages,
  currentPage,
  isLoading,
  hasFetchError,
  handleChangePageFetchCharacters
}: TrombiProps) => {
  return (
    <>
      {isLoading && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            height: '50vh',
            width: '50vw'
          }}
        >
          <CircularProgress />
        </div>
      )}
      {hasFetchError && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Alert severity="error">Une erreur est survenue dans le chargement des données</Alert>
        </div>
      )}
      <Grid container alignItems="stretch" direction="row" spacing={2}>
        {characters &&
          characters.map((character) => (
            <CharacterCard
              key={character.id}
              id={character.id}
              name={character.name}
              thumbnail={character.thumbnail}
            />
          ))}
      </Grid>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '5em'
        }}
      >
        <Pagination
          count={numberPages}
          page={currentPage}
          variant="outlined"
          shape="rounded"
          onChange={(event, page) => {
            event.preventDefault();
            handleChangePageFetchCharacters(page);
          }}
        />
      </div>
    </>
  );
};
