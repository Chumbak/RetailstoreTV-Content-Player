import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { path } from 'ramda'
import StartupActions from '../Redux/StartupRedux'

// process STARTUP actions
export function * startup (action) {
  if (__DEV__ && console.tron) {
    // fully customized!
    console.tron.display({
      name: '🔥 Chumbak Player🔥'
    })
  }
}

export function * fetchStoreList (api) {
  const response = yield call(api.getStores)
  if (response.ok) {
    const stores = path(['data', 'stores'], response)
    yield put(StartupActions.setStores(stores))
  } else {
    yield call(delay, 15 * 1000)
    yield call(fetchStoreList, api)
  }
}

export function * storeLogin (api, action) {
  let { navigate } = action
  yield call(api.storeLogin, navigate)
}

export function * fetchContent (api, action) {
  const response = yield call(api.getStoreContent)
  if (response.ok) {
    const contents = path(['data', 'contents'], response)
    yield put(StartupActions.setContent(contents))
  } else if (response.status === 401) {
    const response = yield call(storeLogin, api, action)
    if (response) {
      yield call(fetchContent, api, action)
    }
  } else {
    yield call(delay, 15 * 1000)
    yield call(fetchContent, api)
  }
}
