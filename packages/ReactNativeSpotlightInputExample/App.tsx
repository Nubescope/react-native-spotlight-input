/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TextInput from 'react-native-spotlight-input'

type InputKey = 'phone' | 'email' | 'text'

interface State {
  phone: string
  email: string
  text: string
}

interface Props {}
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      phone: '',
      email: '',
      text: '',
    }
  }

  handleChangeText = (text: string, key: InputKey) => this.setState(state => ({ ...state, [key]: text }))

  render() {
    const { phone, email, text } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Distraction free text inputs!</Text>

        <Text style={styles.label}>Numeric</Text>
        <TextInput
          style={styles.keyboardInput}
          keyboardType="numeric"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={(text: string) => this.handleChangeText(text, 'phone')}
          value={phone}
          label="Your phone number"
          overlayColor="#2B2D42"
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.keyboardInput}
          keyboardType="email-address"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={(text: string) => this.handleChangeText(text, 'email')}
          value={this.state.email}
          label="Your email"
          overlayColor="#9DB17C"
        />

        <Text style={styles.label}>Default TextInput</Text>
        <TextInput
          style={styles.keyboardInput}
          onChangeText={(text: string) => this.handleChangeText(text, 'text')}
          value={this.state.text}
          label="Any text"
          overlayColor="#D80032"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  keyboardInput: {
    width: 200,
    backgroundColor: 'lightgray',
    color: 'black',
    height: 50,
    fontSize: 17,
    paddingHorizontal: 10,
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    borderRadius: 8,
    paddingVertical: 0,
  },

  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 5,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  label: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 15,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },
})
