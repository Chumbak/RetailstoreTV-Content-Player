import { takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'

/* ------------- Sagas ------------- */

import { startup, fetchStoreList, storeLogin, fetchContent } from './StartupSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.StoreAPI()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(StartupTypes.FETCH_STORES, fetchStoreList, api),

    takeLatest(StartupTypes.STORE_LOGIN, storeLogin, api),

    takeLatest(StartupTypes.FETCH_CONTENT, fetchContent, api)
  ]
}
