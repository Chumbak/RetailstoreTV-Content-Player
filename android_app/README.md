#  Store Player App
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native App Utilizing [Ignite](https://github.com/infinitered/ignite)

## :arrow_up: How to Setup

**Step 1:** cd to android_app

**Step 2:** Install the Application with `yarn` or `npm i`


## :arrow_forward: How to Run App

1. cd to android_app
2. run `react-native run-android`

## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys and other sensitive information in a `.env` file:

```
API_URL=https://myapi.com
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_URL  // 'https://myapi.com'
Secrets.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
```

Sample `.env` file is included in this project for quick setup. It is recommended to ignore `.env` from git to keep those secrets out of your repo.

## :package: Signed Build

For generating signed Android app go through: https://facebook.github.io/react-native/docs/signed-apk-android.html
