import {
  CHANGE_PAGE_FETCH_CHARACTERS,
  FETCH_FAILURE,
  FETCH_INIT,
  FETCH_SUCCESS,
  UPDATE_PAGE_LIMIT
} from './constants.ts';

export type TrombiState = {
  isLoading: boolean;
  hasFetchError: boolean;
  characters: Array<Character>;
  total: number;
  offset: number;
  limit: number;
  currentPage: number;
  numberPages: number;
};

export type Character = {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
};

export type FetchInitAction = {
  type: typeof FETCH_INIT;
};

export type FetchSuccessAction = {
  type: typeof FETCH_SUCCESS;
  payload: {
    characters: Array<Character>;
    total: number;
  };
};

export type FetchFailureAction = {
  type: typeof FETCH_FAILURE;
};

export type TrombiAction = FetchInitAction | FetchSuccessAction | FetchFailureAction;

export type DispatchType = (args: TrombiAction) => TrombiAction;

export type UseTrombiProps = {
  offset: number;
  dataFetchReducerFn?: (state: TrombiState, action: DataFetchReducerAction) => TrombiState;
  setFetchInitFn?: (dispatch: React.Dispatch<DataFetchReducerAction>) => () => void;
  setFetchErrorFn?: (
    dispatch: React.Dispatch<DataFetchReducerAction>
  ) => (payload: FetchErrorPayload) => void;
  setFetchSuccessFn?: (
    dispatch: React.Dispatch<DataFetchReducerAction>
  ) => (payload: FetchSuccessPayload) => void;
  initState?: TrombiState;
};

export type UseTrombiReturn = {
  isLoading: boolean;
  hasFetchError: boolean;
  characters: Array<Character>;
  total: number;
  offset: number;
  limit: number;
  currentPage: number;
  numberPages: number;
  changePageFetchCharacters: (newPageValue: number) => void;
};

export type SetStateFetchLoadingParams = {
  state: TrombiState;
};

export type FetchSuccessPayload = {
  results: Array<Character>;
  total: number;
};

export type SetStateFetchSuccessParams = {
  state: TrombiState;
  payload: FetchSuccessPayload;
};

export type FetchErrorPayload = {
  error: unknown;
};

export type SetStateFetchFailureParams = {
  state: TrombiState;
  payload: FetchErrorPayload;
};

export type UpdatePageLimitPayload = {
  isSmallScreen: boolean;
};

export type SetStateUpdatePageLimitParams = {
  state: TrombiState;
  payload: UpdatePageLimitPayload;
};

export type ChangePagePayload = {
  pageToDisplay: number;
};

export type SetStateChangePageParams = {
  state: TrombiState;
  payload: ChangePagePayload;
};

export type DataFetchReducerAction = {
  type:
    | typeof FETCH_INIT
    | typeof FETCH_SUCCESS
    | typeof FETCH_FAILURE
    | typeof UPDATE_PAGE_LIMIT
    | typeof CHANGE_PAGE_FETCH_CHARACTERS;
  payload: FetchSuccessPayload | FetchErrorPayload | UpdatePageLimitPayload | ChangePagePayload;
  setStateFetchLoadingFn: (params: SetStateFetchLoadingParams) => TrombiState;
  setStateFetchSuccessFn: (params: SetStateFetchSuccessParams) => TrombiState;
  setStateFetchFailureFn: (params: SetStateFetchFailureParams) => TrombiState;
  setStateUpdatePageLimitFn: (params: SetStateUpdatePageLimitParams) => TrombiState;
  setStateChangePageFn: (params: SetStateChangePageParams) => TrombiState;
};

export type TrombiProps = {
  isLoading: boolean;
  hasFetchError: boolean;
  characters: Array<Character>;
  total: number;
  offset: number;
  limit: number;
  currentPage: number;
  numberPages: number;
  handleChangePageFetchCharacters: (newPageValue: number) => void;
};
