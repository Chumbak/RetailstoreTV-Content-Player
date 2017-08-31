# react-native-double-click

A Component Wrapper for Double Click/Tap, made for React Native, works on both Android and iOS.

## Installation
* `npm install --save react-native-double-click`

## Usage
```js
import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
} from 'react-native';
import DoubleClick from 'react-native-double-click';

export default class doubleClicker extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    Alert.alert('This is awesome \n Double tap succeed');
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <Text style={{ fontSize: 20 }}>
          Welcome to React Native!
        </Text>
        <DoubleClick onClick={this.handleClick}>
          <Text style={{ fontSize: 26 }}>
            Please tap me twice!
          </Text>
        </DoubleClick>
      </View>
    );
  }
}
```

## Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| delay | number | 300 | (in milliseconds) How fast double click/tap be pressed (number below 200 might not worked) |
| radius | number | 20 | Radius for click/tap |
| onClick | function | () => Alert.alert('Double Tap Succeed') | Execute function after double click/tap be pressed |

## License
MIT

