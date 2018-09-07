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
        <Text style={styles.welcome}>Stop fighting with the keyboard!</Text>
        <Text style={styles.description}>Simple drop-in replacement for TextInput</Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <SimpleExample />
          <ComplexHeaderExample />
          <MultilineExample />
          <UncenteredExample />
          <ComplexHeaderExample label="Another twitter account" />
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 5,
    marginTop: 50,
    marginHorizontal: 20,
    fontFamily: 'Avenir Next',
    fontWeight: '500',
  },

  description: {
    fontSize: 16,
    textAlign: 'center',
    margin: 5,
    marginBottom: 20,
    marginHorizontal: 10,
    fontFamily: 'Avenir Next',
    fontWeight: '400',
  },
})
