# React Native Spotlight Input

Simple drop-in replacement for React Native `<TextInput>` that makes devs happy :smile:

This is the very first version and that's why it offers just a few props to customize it: `overlayColor`, `header`, `footer` and `animationConfig`.
However, that covers a lot of use cases.

<img src="./demo.gif" width="320" alt="Stop fighting with the keyboard!">

## Try it!

We've created [this snack]() so you can give it a try!

## Installation

```
yarn add react-native-spotlight-input
```

## Usage

```js
import React, { Component } from 'react'
import Text from 'react-native'
import TextInput from 'react-native-spotlight-input'

class Example extends Component {
  render() {
    return (
      <TextInput
        // ...traditionalInputProps
        overlayColor="#0496FF"
        header={() => <Text>Header</Text>}
        footer={() => <Text>Footer</Text>}
        animationConfig={{
          duration: 350,
          delay: 100,
        }}
      />
    )
  }
}
```

### Props

#### `overlayColor`

A `string` defining the background color when focused

```js
const Example = () => (
  <TextInput
    // ...other props
    overlayColor="#0496FF"
  />
)
```

#### `header`

A component (could be either `function` or `class` component) that takes `inputValue` as a prop.
Will be rendered before the `TextInput` when focused.

```js
const Header = ({ inputValue }) => <Text>You are writing this: {inputValue}</Text>

const WithHeader = () => (
  <TextInput
    // ...other props
    header={Header}
  />
)
```

#### `footer`

A component (could be either function or class component) that takes `inputValue` as a prop.
Will be rendered after the `TextInput` when focused.

```js
const Footer = ({ inputValue }) => <Text>You've written this: {inputValue}</Text>

const WithFooter = () => (
  <TextInput
    // ...other props
    footer={Footer}
  />
)
```

#### `animationConfig`

Is an object to override `Animated.timing` configuration.

```js
import { Easing } from 'react-native'

const animationConfig = {
  delay: 100,
  duration: 500,
  easing: Easing.in(Easing.ease),
}

const WithCustomAnimationConfig = () => (
  <TextInput
    // ...other props
    animationConfig={animationConfig}
  />
)
```

Default value is

```js
{
  delay: 0,
  duration: 350,
  easing: Easing.inOut(Easing.ease),
}
```

Notice that `useNativeDriver` and `toValue` **cannot be overwritten**.

## Examples

See the `ReactNativeSpotlightInputExample` folder in `packages` to find more detailed examples.
