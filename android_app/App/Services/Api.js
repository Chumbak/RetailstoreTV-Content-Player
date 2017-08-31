// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import { AsyncStorage, ToastAndroid } from 'react-native'
import Secrets from 'react-native-config'

// our "constructor"
const StoreAPI = (baseURL = Secrets.API_URL) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 30 second timeout...
    timeout: 30000
  })

  const getStores = () => {
    return api.get('storecms/stores/list')
    .then((response) => {
      return response
    })
  }

  const storeLogin = async (navigate) => {
    let storeDetails = await AsyncStorage.getItem('StoreDetails')
    storeDetails = JSON.parse(storeDetails)
    var data = new FormData()
    data.append('store_code', storeDetails.store_code)
    data.append('password', storeDetails.password)
    return api.post('storecms/store/login', data)
    .then(async (response) => {
      if (response.ok) {
        let { status } = response.data
        if (status === 200) {
          await AsyncStorage.setItem('LoggedIn', 'true')
          navigate('SlideShowScreen')
        } else {
          ToastAndroid.show('Invalid password', ToastAndroid.SHORT)
          await AsyncStorage.setItem('LoggedIn', 'false')
        }
      } else {
        ToastAndroid.show(response.problem, ToastAndroid.SHORT)
      }
      return response
    })
  }

  const getStoreContent = async () => {
    return api.get('storecms/store/contents').then((response) => {
      return response
    })
  }

  return {
    getStores,
    storeLogin,
    getStoreContent
  }
}

// let's return back our create method as the default.
export default {
  StoreAPI
}
