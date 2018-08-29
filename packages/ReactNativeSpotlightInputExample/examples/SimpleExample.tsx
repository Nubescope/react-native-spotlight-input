import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TextInput from 'react-native-spotlight-input'

interface Props {}

interface State {
  text: string
}

export default class PhoneExample extends Component<Props, State> {
  state = {
    text: '',
  }

  handleChangeText = (text: string) => this.setState({ text })

  render() {
    const { text } = this.state

    return (
      <View>
        <Text style={styles.label}>Simple example</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={this.handleChangeText}
          value={text}
          header={<Text style={styles.header}>Your phone number</Text>}
          overlayColor="#72B01D"
          selectionColor="#5E9118"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  input: {
    width: 200,
    height: 50,
    backgroundColor: 'lightgray',
    color: 'black',
    fontSize: 17,
    paddingHorizontal: 10,
    fontFamily: 'Avenir',
    borderRadius: 8,
    paddingVertical: 0,
  },

  header: {
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    paddingTop: 70,
    paddingBottom: 30,
  },
})
