import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import SlideShowScreen from '../Containers/SlideShowScreen'
import InitialScreen from '../Containers/InitialScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  SlideShowScreen: { screen: SlideShowScreen },
  InitialScreen: { screen: InitialScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'InitialScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
