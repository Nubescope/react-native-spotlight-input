# React Native Spotlight Input

Simple drop-in replacement for React Native `<TextInput>` that makes devs happy :smile:

This is the very first version and that's why it offers just a few props to customize it: `overlayColor`, `header`, `footer` and `animationConfig`.
However, that covers a lot of use cases.

<img src="./demo.gif" width="320" alt="Stop fighting with the keyboard!">

## Try it!

> COMING SOON!  
> For some reason, snack is not able to import the latest version or `react-native-spotlight-input` (0.0.8) and the previous one has an issue.  
> Once solved, we'll publish the link ;)

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
const Footer = ({ inputValue }) => <Text>You have written this: {inputValue}</Text>

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

#### `collapseOnKeyboardHide`

Decides wether or not the component should collapse on keyboard hide. Default value is `true`.

```js
const NoCollapseOnKeyboardHide = () => (
  <TextInput
    // ...other props
    collapseOnKeyboardHide={false}
  />
)
```

### Methods

Besides the props, you can control it using the component ref.

#### `expand()`

Calling `componentRef.expand()` you can show the _expanded_ mode of the component

#### `collapse()`

Calling `componentRef.collapse()` you can go back to the _collapsed_ mode of the component

#### Example using both methods

```js
class ControlledInputExample extends Component {
  constructor() {
    super()
    this.componentRef = React.createRef()
  }

  handleExpandButtonPress = () => {
    this.componentRef.expand()
  }

  handleCollapseButtonPress = () => {
    this.componentRef.collapse()
  }

  render() {
    return (
      <View>
        <TextInput
          ref={this.componentRef}
          footer={() => <Button title="Collapse" onPress={this.handleCollapseButtonPress} />}
          collapseOnKeyboardHide={false}
        />
        <Button title="Expand" onPress={this.handleExpandButtonPress} />
      </View>
    )
  }
}
```

## Examples

See the `ReactNativeSpotlightInputExample` folder in `packages` to find more detailed examples.

## Caveats

- In DEV mode you can't use the developer tools when input is focused due to [this RN issue](https://github.com/facebook/react-native/issues/17986)
- If input has borders then those will be visible during transition to focused state
