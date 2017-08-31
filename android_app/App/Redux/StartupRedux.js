import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchStores: null,
  setStores: ['storesList'],
  fetchContent: ['navigate'],
  setContent: ['storeContent'],
  startup: null,
  storeLogin: ['navigate']
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  storesList: null,
  storeContent: null
})

/* ------------- Reducers ------------- */

export const listData = (state, { storesList }) => state.merge({ storesList })

export const storeData = (state, { storeContent }) => state.merge({ storeContent })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_STORES]: listData,
  [Types.SET_CONTENT]: storeData,
  [Types.STORE_LOGIN]: null
})
