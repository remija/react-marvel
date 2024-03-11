import { useEffect, useReducer } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { CHANGE_PAGE_FETCH_CHARACTERS, FETCH_SUCCESS, UPDATE_PAGE_LIMIT } from './constants.js';
import {
  ChangePagePayload,
  DataFetchReducerAction,
  FetchSuccessPayload,
  SetStateChangePageParams,
  SetStateFetchSuccessParams,
  SetStateUpdatePageLimitParams,
  TrombiState,
  UpdatePageLimitPayload,
  UseTrombiProps,
  UseTrombiReturn
} from './Trombi.types.ts';
import { useQuery } from 'react-query';
import { fetchCharacters } from './fetchCharacters.ts';

const PAGE_LIMIT_MOBILE = 5;
const PAGE_LIMIT_DESKTOP = 8;

const initialState: TrombiState = {
  isLoading: false,
  hasFetchError: false,
  characters: [],
  total: 0,
  offset: 0,
  limit: PAGE_LIMIT_MOBILE,
  currentPage: 1,
  numberPages: 0
};

export const setStateUpdatePageLimit = ({
  state,
  payload
}: SetStateUpdatePageLimitParams): TrombiState => {
  return {
    ...state,
    limit: payload.isSmallScreen ? PAGE_LIMIT_MOBILE : PAGE_LIMIT_DESKTOP
  };
};

export const setStateChangePage = ({ state, payload }: SetStateChangePageParams): TrombiState => ({
  ...state,
  offset: (payload.pageToDisplay - 1) * state.limit,
  currentPage: payload.pageToDisplay
});

export const setStateFetchSuccess = ({
  state,
  payload
}: SetStateFetchSuccessParams): TrombiState => {
  const totalResults = payload?.total ?? 0;

  const totalNumberPages = totalResults > 0 ? Math.ceil(totalResults / state.limit) : 0;
  const newCurrentPage = Math.ceil(state.offset / state.limit) + 1;

  return {
    ...state,
    characters: payload?.results,
    total: totalResults,
    numberPages: totalNumberPages,
    currentPage: newCurrentPage
  };
};

const dataFetchReducer = (
  state: TrombiState = initialState,
  {
    type,
    payload,
    setStateFetchSuccessFn = setStateFetchSuccess,
    setStateUpdatePageLimitFn = setStateUpdatePageLimit,
    setStateChangePageFn = setStateChangePage
  }: DataFetchReducerAction
) => {
  switch (type) {
    case FETCH_SUCCESS:
      return setStateFetchSuccessFn({ state, payload: payload as FetchSuccessPayload });
    case UPDATE_PAGE_LIMIT:
      return setStateUpdatePageLimitFn({ state, payload: payload as UpdatePageLimitPayload });
    case CHANGE_PAGE_FETCH_CHARACTERS:
      return setStateChangePageFn({ state, payload: payload as ChangePagePayload });
    default:
      return state;
  }
};

const setFetchSuccess =
  (dispatch: React.Dispatch<DataFetchReducerAction>) => (payload: FetchSuccessPayload) =>
    dispatch({ type: FETCH_SUCCESS, payload } as DataFetchReducerAction);
const setUpdatePageLimit =
  (dispatch: React.Dispatch<DataFetchReducerAction>) => (isSmallScreen: boolean) =>
    dispatch({
      type: UPDATE_PAGE_LIMIT,
      payload: {
        isSmallScreen
      }
    } as DataFetchReducerAction);

export const useTrombi = ({
  offset,
  dataFetchReducerFn = dataFetchReducer,
  setFetchSuccessFn = setFetchSuccess,
  initState = initialState
}: UseTrombiProps): UseTrombiReturn => {
  const [trombiState, dispatch] = useReducer(
    dataFetchReducerFn,
    offset ? { ...initState, offset } : initState
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const changePageFetchCharacters = (newPageValue: number) => {
    dispatch({
      type: CHANGE_PAGE_FETCH_CHARACTERS,
      payload: {
        pageToDisplay: newPageValue
      }
    } as DataFetchReducerAction);
  };

  const controller = new AbortController();
  const signal = controller.signal;

  const { data, isLoading, isError } = useQuery(
    ['characters', trombiState.offset, trombiState.limit],
    async () => fetchCharacters(trombiState.offset, trombiState.limit, signal)
  );

  useEffect(() => {
    setUpdatePageLimit(dispatch)(isSmallScreen);
  }, [isSmallScreen]);

  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      pathname: '/',
      search: createSearchParams({ offset: trombiState.offset.toString() }).toString()
    });
  }, [navigate, trombiState.offset]);

  useEffect(() => {
    setFetchSuccessFn(dispatch)(data?.data);
  }, [data?.data, setFetchSuccessFn]);

  return {
    ...trombiState,
    isLoading: isLoading,
    hasFetchError: isError,
    changePageFetchCharacters
  };
};
