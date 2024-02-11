import { useEffect, useReducer } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import MD5 from 'crypto-js/md5';
import {
  CHANGE_PAGE_FETCH_CHARACTERS,
  FETCH_FAILURE,
  FETCH_INIT,
  FETCH_SUCCESS,
  UPDATE_PAGE_LIMIT
} from './constants.js';
import {
  ChangePagePayload,
  DataFetchReducerAction,
  FetchErrorPayload,
  FetchSuccessPayload,
  SetStateChangePageParams,
  SetStateFetchFailureParams,
  SetStateFetchLoadingParams,
  SetStateFetchSuccessParams,
  SetStateUpdatePageLimitParams,
  TrombiState,
  UpdatePageLimitPayload,
  UseTrombiProps,
  UseTrombiReturn
} from './Trombi.types.ts';

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

export const setStateFetchLoading = ({ state }: SetStateFetchLoadingParams) => ({
  ...state,
  characters: [],
  total: 0,
  numberPages: 0,
  isLoading: true,
  hasNoResult: false,
  hasFetchError: false
});

export const setStateFetchSuccess = ({
  state,
  payload
}: SetStateFetchSuccessParams): TrombiState => {
  const totalResults = payload.total ?? 0;

  const totalNumberPages = totalResults > 0 ? Math.ceil(totalResults / state.limit) : 0;
  const newCurrentPage = Math.ceil(state.offset / state.limit) + 1;

  return {
    ...state,
    isLoading: false,
    characters: payload.results,
    total: totalResults,
    numberPages: totalNumberPages,
    currentPage: newCurrentPage
  };
};

export const setStateFetchFailure = ({ state }: SetStateFetchFailureParams): TrombiState => {
  return {
    ...state,
    hasFetchError: true,
    isLoading: false,
    characters: []
  };
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

const dataFetchReducer = (
  state: TrombiState = initialState,
  {
    type,
    payload,
    setStateFetchLoadingFn = setStateFetchLoading,
    setStateFetchSuccessFn = setStateFetchSuccess,
    setStateFetchFailureFn = setStateFetchFailure,
    setStateUpdatePageLimitFn = setStateUpdatePageLimit,
    setStateChangePageFn = setStateChangePage
  }: DataFetchReducerAction
) => {
  switch (type) {
    case FETCH_INIT:
      return setStateFetchLoadingFn({ state });
    case FETCH_SUCCESS:
      return setStateFetchSuccessFn({ state, payload: payload as FetchSuccessPayload });
    case FETCH_FAILURE:
      return setStateFetchFailureFn({ state, payload: payload as FetchErrorPayload });
    case UPDATE_PAGE_LIMIT:
      return setStateUpdatePageLimitFn({ state, payload: payload as UpdatePageLimitPayload });
    case CHANGE_PAGE_FETCH_CHARACTERS:
      return setStateChangePageFn({ state, payload: payload as ChangePagePayload });
    default:
      return state;
  }
};

const setFetchInit = (dispatch: React.Dispatch<DataFetchReducerAction>) => () =>
  dispatch({ type: FETCH_INIT } as DataFetchReducerAction);
const setFetchError =
  (dispatch: React.Dispatch<DataFetchReducerAction>) => (payload: FetchErrorPayload) =>
    dispatch({ type: FETCH_FAILURE, payload } as unknown as DataFetchReducerAction);
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
  setFetchInitFn = setFetchInit,
  setFetchErrorFn = setFetchError,
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

  useEffect(() => {
    const fetchLoadCharacters = async () => {
      try {
        setFetchInitFn(dispatch)();

        const timestamp = new Date().getTime();
        const stringToHash = `${timestamp}${import.meta.env.VITE_MARVEL_API_PRIVATE_KEY}${import.meta.env.VITE_MARVEL_API_PUBLIC_KEY}`;
        const hash = MD5(stringToHash);

        const searchParams = new URLSearchParams({
          offset: trombiState.offset.toString(),
          limit: trombiState.limit.toString(),
          hash: hash.toString(),
          ts: timestamp.toString(),
          apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
        }).toString();

        const response = await fetch(`/api/marvel/characters?${searchParams}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const fetchResult = await response.json();

        setFetchSuccessFn(dispatch)(fetchResult?.data);
      } catch (error) {
        setFetchErrorFn(dispatch)({ error });
      }
    };

    fetchLoadCharacters();
  }, [trombiState.offset, trombiState.limit, setFetchInitFn, setFetchErrorFn, setFetchSuccessFn]);

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

  return {
    ...trombiState,
    changePageFetchCharacters
  };
};
