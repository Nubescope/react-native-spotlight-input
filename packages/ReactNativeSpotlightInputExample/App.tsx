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
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import MultilineExample from './examples/MultilineExample'
import UncenteredExample from './examples/UncenteredExample'
import SimpleExample from './examples/SimpleExample'
import ComplexHeaderExample from './examples/ComplexHeaderExample'

interface Props {}
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Distraction free text input!</Text>
        <Text style={styles.description}>
          No matter how long a form is, or the input position, it will work out of the box
        </Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <SimpleExample />
          <ComplexHeaderExample />
          <MultilineExample />
          <UncenteredExample />
        </ScrollView>
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

  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 5,
    marginTop: 50,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  description: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    fontFamily: 'Avenir Next',
    fontWeight: '400',
  },
})
