import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TextInput from 'react-native-spotlight-input'

interface Props {}

interface State {
  text: string
}

export default class UncenteredExample extends Component<Props, State> {
  state = {
    text: '',
  }

  handleChangeText = (text: string) => this.setState({ text })

  render() {
    const { text } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Uncentered input</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleChangeText}
          value={text}
          header={<Text style={styles.header}>Not centered input</Text>}
          overlayColor="#6457A6"
          selectionColor="#5B5097"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
  },

  label: {
    fontSize: 18,
    textAlign: 'center',
    marginRight: 10,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  input: {
    flex: 1,
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
