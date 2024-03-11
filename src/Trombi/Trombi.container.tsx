import { useLocation } from 'react-router-dom';
import { useTrombi } from './TrombiWithReactQuery.hook';
import { Trombi } from './Trombi.js';

const TrombiEnhanced = () => {
  const paramOffset = new URLSearchParams(useLocation().search).get('offset');

  let paramOffsetNumber = 0;

  if (paramOffset) {
    paramOffsetNumber = Number.parseInt(paramOffset, 10);
  }

  const {
    offset,
    limit,
    total,
    numberPages,
    currentPage,
    characters,
    isLoading,
    hasFetchError,
    changePageFetchCharacters
  } = useTrombi({ offset: paramOffsetNumber });

  return (
    <Trombi
      offset={offset}
      limit={limit}
      total={total}
      numberPages={numberPages}
      currentPage={currentPage}
      characters={characters}
      isLoading={isLoading}
      hasFetchError={hasFetchError}
      handleChangePageFetchCharacters={changePageFetchCharacters}
    />
  );
};

export default TrombiEnhanced;
