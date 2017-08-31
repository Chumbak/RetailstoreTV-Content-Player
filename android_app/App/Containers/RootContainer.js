import React, { Component } from 'react'
import { Linking, AppState, View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import BackgroundTimer from 'react-native-background-timer'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      // Open app from bg after 30 secs
      this.openAppTimer = BackgroundTimer.setTimeout(() => {
        Linking.openURL('ChumbakStorePlayer://').catch(err => console.error('Couldn\'t open ChumbakStoreTV: ', err))
      }, 30 * 1000)
    } else {
      BackgroundTimer.clearTimeout(this.openAppTimer)
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar hidden />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
