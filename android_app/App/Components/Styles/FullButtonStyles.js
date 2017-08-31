import { StyleSheet } from 'react-native'
import { Fonts } from '../../Themes/'

export default StyleSheet.create({
  button: {
    marginTop: 30,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#987ded'

  },
  buttonText: {
    margin: 18,
    textAlign: 'center',
    color: 'white',
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold
  }
})
