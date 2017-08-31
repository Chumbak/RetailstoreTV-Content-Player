import React, { Component } from 'react'
import { View, Dimensions, Image, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import Video from 'react-native-video'
import DoubleClick from 'react-native-double-click'
import * as Animatable from 'react-native-animatable';

import accessData from '../Utils/AccessData'
import updateData from '../Utils/UpdateData'

import StartupActions from '../Redux/StartupRedux'

// Styles
import styles from './Styles/LaunchScreenStyles'
import { Images, Metrics } from '../Themes'

const { width, height } = Dimensions.get('window')

class SlideShowScreen extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      size: { width, height },
      layout: {},
      filePaths: [],
      players: {},
      paused: {},
      itemsLen: 0,
      currentSlide: 0
    }
    this.players = {}
    this.init = false
  }

  componentWillMount () {
    this.handleClick.bind(this)
    this.accessContent()
    this.props.fetchContent(this.props.navigation.navigate)
    // check for updates every 1 hour
    this.fetchInterval = setInterval(() => {
      console.log('Checking for updates...')
      this.props.fetchContent(this.props.navigation.navigate)
    }, 60 * 60 * 1000)
    // 
    this.setSlideTimeout();
  }

  componentWillUnmount () {
    // clear intervals
    clearInterval(this.fetchInterval)
    clearInterval(this.slideInterval)
  }

  componentWillReceiveProps (nextProps) {
    let { storeContent } = nextProps
    if (storeContent) {
      updateData(storeContent, this.state.filePaths).then((data) => {
        console.log('Updated data!');
        this.accessContent()
      })
      .catch(() => {
        console.log('No updates!')
      })
    }
  }

  accessContent = () => {
    accessData().then((data) => {
      this.setState({ filePaths: data, itemsLen: data.length })
    })
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({
      size: {
        width: layout.width,
        height: layout.height
      }
    })
  }

  // go to next slide
  nextSlide = (slideNum = this.state.currentSlide) => {
    let filePaths = this.state.filePaths
    let nextPage = this.getNextPage(slideNum)
    // if next slide is video then reset and play it
    if (filePaths[nextPage].type === 'video') {
      this.players['v' + nextPage].seek(0)
      clearInterval(this.slideInterval)
      // wait till slide is visible and then play video
      setTimeout(() => {
        this.toggleVideo(nextPage, false)
      }, 1000);
    }
    // this will call render() and next slide will be shown
    this.setState({ currentSlide: this.getNextPage() })
  }

  // initially pause all videos after load
  onVideoLoad = (index) => {
    if (index) {
      this.toggleVideo(index, true)
    } else if (index === 0) {
      clearInterval(this.slideInterval)
      this.toggleVideo(index, false)
    }
  }

  onVideoEnd = () => {
    let slideNum = this.state.currentSlide;
    this.toggleVideo(this.state.currentSlide, true)
    setTimeout(() => {
      this.setSlideTimeout(true)
    }, 1500)
  }

  onVideoError = () => {
    this.onVideoEnd()
  }

  getNextPage = (slideNum = this.state.currentSlide) => {
    let nextPage = slideNum + 1
    if (nextPage === this.state.itemsLen) {
      nextPage = 0
    }
    return nextPage
  }

  // toggle video state between play and pause
  toggleVideo = (index, action) => {
    let paused = this.state.paused
    paused['v' + index] = action
    this.setState({ paused: paused })
  }

  // on double click check for updates
  handleClick () {
    ToastAndroid.show('Updating', ToastAndroid.SHORT)
    this.props.fetchContent(this.props.navigation.navigate)
  }

  // Interval to loop content
  setSlideTimeout(gotoNext) {
    this.slideInterval = setInterval(() => {
      // check if there are slides to show
      if (this.state.itemsLen > 0) {
        this.nextSlide()
      }
    }, Metrics.slideShow.slideDelay)
    // immediately goto next slide if gotoNext flag is set - useful when video ends
    if (gotoNext) {
      this.nextSlide();
    }
  }

  // apply fade animation for current slide and previous slide else hide the slide
  getStyles(index) {
    let prevIndex = this.state.currentSlide ? this.state.currentSlide - 1 : this.state.itemsLen - 1;
    return {
      display: (index === this.state.currentSlide || index === prevIndex) ? 'flex': 'none',
      position: 'absolute'
    }
  }

  render () {
    let contents = (
      <View style={styles.mainContainer}>
        <DoubleClick onClick={this.handleClick}>
          <Image source={Images.fallback} style={[styles.backgroundImage, this.state.size]} />
        </DoubleClick>
      </View>
    )
    if (this.state.filePaths.length > 0) {
      contents = this.state.filePaths.map((item, index) => {
        if (item.type === 'video') {
          return (
            <Animatable.View
              animation={this.state.currentSlide == index ? 'fadeIn': 'fadeOut'}
              duration={Metrics.slideShow.fadeDelay}
              delay={Metrics.slideShow.fadeDelay}
              style={this.getStyles(index)}
              key={'video' + index}>
              <DoubleClick onClick={this.handleClick}>
                <Video source={{ uri: 'file://' + item.path }}
                  ref={(ref) => { this.players['v' + index] = ref }}
                  paused={this.state.paused['v' + index]}
                  resizeMode='cover'
                  onLoad={() => this.onVideoLoad(index)}
                  onEnd={this.onVideoEnd}
                  onError={this.onVideoError}
                  style={this.state.size}
                />
              </DoubleClick>
            </Animatable.View>
          )
        } else {
          return (
            <Animatable.View
              animation={this.state.currentSlide == index ? 'fadeIn': 'fadeOut'}
              duration={Metrics.slideShow.fadeDelay}
              delay={Metrics.slideShow.fadeDelay}
              style={this.getStyles(index)}
              key={'image' + index}>
              <DoubleClick onClick={this.handleClick}>
                <Image source={{ uri: 'file://' + item.path }} style={this.state.size} />
              </DoubleClick>
            </Animatable.View>
          )
        }
      })
    }
    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        { contents }
      </View>
    )
  }
}

const mapStateToProps = state => ({ storeContent: state.app.storeContent })

const mapDispatchToProps = (dispatch) => ({
  fetchContent: (navigate) => dispatch(StartupActions.fetchContent(navigate))
})

export default connect(mapStateToProps, mapDispatchToProps)(SlideShowScreen)
