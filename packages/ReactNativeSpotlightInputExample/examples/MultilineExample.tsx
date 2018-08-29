import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TextInput from 'react-native-spotlight-input'

interface Props {}

interface State {
  text: string
}

export default class MultilineExample extends Component<Props, State> {
  state = {
    text: '',
  }

  handleChangeText = (text: string) => this.setState({ text })

  render() {
    const { text } = this.state

    return (
      <View>
        <Text style={styles.label}>Multiline</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleChangeText}
          value={text}
          header={<Text style={styles.header}>Multiline</Text>}
          overlayColor="#D65780"
          selectionColor="#B04869"
          multiline
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
    width: 300,
    height: 100,
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
