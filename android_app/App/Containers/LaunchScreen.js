import React, { Component } from 'react'
import { AsyncStorage, ScrollView, Text, Image, View, Picker, TextInput, ToastAndroid, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import StartupActions from '../Redux/StartupRedux'
import FullButton from '../Components/FullButton'
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

const { width, height } = Dimensions.get('window')

class LaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedStore: '',
      size: { width, height }
    }
  }

  // change wallpaper dimension on layout change
  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({
      size: {
        width: layout.width,
        height: layout.height
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    let { storesList } = nextProps
    if (storesList) {
      // first store selected by default
      this.setState({ selectedStore: storesList[0].code })
    }
  }

  async setStore () {
    if (this.state.pwd) {
      var data = {
        'store_code': this.state.selectedStore,
        'password': this.state.pwd
      }
      await AsyncStorage.setItem('StoreDetails', JSON.stringify(data))
      this.props.storeLogin(this.props.navigation.navigate)
    } else {
      ToastAndroid.show('Password should not be empty', ToastAndroid.SHORT)
    }
  }

  render () {
    let { storesList } = this.props
    let contents = (
      <View style={styles.mainContainer}>
        <View>
          <Image source={Images.background} style={[styles.backgroundImage, this.state.size]} />
        </View>
      </View>
    )
    if (storesList) {
      let pickerItems = storesList.map((store) => {
        return (
          <Picker.Item key={store.code} label={store.name + ', ' + store.city} value={store.code} />
        )
      })
      contents = (
        <View style={styles.mainContainer} onLayout={this._onLayoutDidChange}>
          <View>
            <Image source={Images.background} style={[styles.backgroundImage, this.state.size]} />
          </View>
          <View>
            <ScrollView style={styles.container}>
              <View style={styles.section}>
                <Text style={styles.sectionText}>Select Store:</Text>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.5 }} />
                    <Picker
                      selectedValue={this.state.selectedStore}
                      onValueChange={(itemValue, itemIndex) => this.setState({selectedStore: itemValue})}
                      style={{ color: 'white', flex: 0.8 }}>
                      { pickerItems }
                    </Picker>
                    <View style={{ flex: 0.5 }} />
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 0.5 }} />
                  <View style={{ flex: 0.8 }}>
                    <TextInput
                      secureTextEntry
                      onChangeText={(pwd) => this.setState({pwd})}
                      placeholder='Enter store password'
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      style={{ borderBottomColor: '#987ded', borderBottomWidth: 2 }}
                      autoCapitalize='none'
                      autoCorrect={false}
                      selectionColor='white'
                    />
                  </View>
                  <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 0.8 }}>
                      <FullButton
                        text='Submit'
                        onPress={() => this.setStore()}
                      />
                    </View>
                    <View style={{ flex: 0.5 }} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View />
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        { contents }
      </View>
    )
  }
}

const mapStateToProps = state => ({ storesList: state.app.storesList })

const mapDispatchToProps = (dispatch) => ({
  storeLogin: (navigate) => dispatch(StartupActions.storeLogin(navigate))
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
