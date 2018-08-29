import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import TextInput from 'react-native-spotlight-input'

interface Props {}

interface State {
  text: string
}

const Header = () => (
  <View style={styles.header}>
    <Image source={require('./twitter-logo.png')} style={styles.image} />
    <Text style={styles.headerLabel}>Your twitter account</Text>
  </View>
)

export default class ComplexHeaderExample extends Component<Props, State> {
  state = {
    text: '',
  }

  handleChangeText = (text: string) => this.setState({ text })

  render() {
    const { text } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Using a header with image</Text>
        <TextInput
          style={styles.input}
          keyboardType="twitter"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={this.handleChangeText}
          value={text}
          header={<Header />}
          overlayColor="#0496FF"
          selectionColor="#047BD1"
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
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    // paddingTop: 70,
    // paddingBottom: 30,
  },

  headerLabel: {
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    marginBottom: 10,
  },

  image: {
    width: 200,
    height: 200,
    tintColor: 'white',
  },
})
