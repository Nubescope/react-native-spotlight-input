import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'

import TextInput from 'react-native-spotlight-input'

const IMAGE_SIZE = Dimensions.get('window').height / 4

interface Props {
  label?: string
}

interface State {
  text: string
}

interface HeaderProps {
  inputValue: string
}

const Header = ({ inputValue }: HeaderProps) => (
  <View style={styles.header}>
    <Image source={require('./twitter-logo.png')} style={styles.image} />
    <Text style={styles.headerLabel}>Your twitter account is</Text>
    <Text style={styles.accountLabel}>@{inputValue}</Text>
  </View>
)

export default class ComplexHeaderExample extends Component<Props, State> {
  state = {
    text: '',
  }

  static defaultProps = {
    label: 'Custom header with image',
  }

  handleChangeText = (text: string) => this.setState({ text })

  render() {
    const { label } = this.props
    const { text } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          keyboardType="twitter"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={this.handleChangeText}
          value={text}
          selectionColor="#047BD1"
          overlayColor="#0496FF"
          header={Header}
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
    width: 220,
    height: 50,
    backgroundColor: '#e8e8e8',
    color: '#333',
    fontSize: 17,
    paddingHorizontal: 20,
    fontFamily: 'Avenir',
    borderRadius: 25,
    paddingVertical: 0,
  },

  header: {
    marginTop: '10%',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerLabel: {
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    marginBottom: 5,
  },

  accountLabel: {
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    marginBottom: 5,
  },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    tintColor: 'white',
  },
})
