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
      <View style={styles.container}>
        <Text style={styles.label}>Basic example with label</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={this.handleChangeText}
          value={text}
          header={() => <Text style={styles.header}>Your phone number</Text>}
          overlayColor="#F5FCFFf4"
          selectionColor="#888"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  input: {
    width: 150,
    height: 40,
    backgroundColor: '#e8e8e8',
    color: '#333',
    fontSize: 20,
    fontFamily: 'Avenir',
    textAlign: 'center',
    paddingVertical: 0,
  },

  header: {
    fontSize: 25,
    color: '#333',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    paddingTop: '15%',
    paddingBottom: '10%',
  },
})
