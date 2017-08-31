import { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import StartupActions from '../Redux/StartupRedux'

class InitialScreen extends Component {
  componentDidMount () {
    this.getStore()
  }

  async getStore () {
    // take user to slideshow screen if already logged in
    let loggedIn = await AsyncStorage.getItem('LoggedIn')
    if (loggedIn === 'true') {
      console.log('loggedin!')
      this.props.navigation.navigate('SlideShowScreen')
    } else {
      console.log('Not loggedin!')
      this.props.fetchStores()
      this.props.navigation.navigate('LaunchScreen')
    }
  }

  render () {
    return null
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  fetchStores: () => dispatch(StartupActions.fetchStores())
})

export default connect(null, mapDispatchToProps)(InitialScreen)
