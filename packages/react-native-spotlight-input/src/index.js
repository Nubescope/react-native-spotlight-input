import React, { PureComponent } from 'react'
import {
  View,
  Animated,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Easing,
  Modal,
  Platform,
  StatusBar,
  Dimensions,
  ColorPropType,
} from 'react-native'

import PropTypes from 'prop-types'

// import colors from '@lib/colors'
// import fonts from '@lib/fonts'

const SUPPORTED_ORIENTATIONS = ['portrait', 'landscape']
const windowWidth = Dimensions.get('window').width

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

/**
 * Potential props
 */

const ANIMATION_DURATION = 350
const DEFAULT_OVERLAY_COLOR = 'white'
const BACKGROUND_OPACITY = 1
const INPUT_OFFSET_TOP = 100
const INPUT_SCALE = 1.1

/**
 * SpotlightTextInput
 */

class SpotlightTextInput extends PureComponent {
  constructor() {
    super()
    this.animationProgress = new Animated.Value(0)

    this.state = {
      expanded: false,
      showContent: true,
      hideModalContent: true,
    }

    this.clonedInputRef = React.createRef()
    this.originalInputRef = React.createRef()
  }

  componentDidMount() {
    const keyboardHideEvent = Platform.select({ ios: 'keyboardWillHide', android: 'keyboardDidHide' })
    this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, this.handleKeyboardHide)
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }

  animateIn = async () => {
    const inputInitialStyle = await this.getInputLayoutStyle()
    this.setState({ expanded: true, showContent: true, inputInitialStyle }, () => {
      Animated.timing(this.animationProgress, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        // eslint-disable-next-line no-underscore-dangle
        this.clonedInputRef.current._component.focus()
      })
    })
  }

  animateOut = () => {
    Animated.timing(this.animationProgress, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      easing: Easing.in,
    }).start(() => {
      this.setState({ showContent: false }, () => {
        this.setState({ expanded: false })
      })
    })
  }

  keyboardWillShow = () => this.animateIn()
  handleKeyboardHide = () => this.animateOut()

  handleOriginalInputRef = ref => {
    this.originalInputRef = ref
  }

  handleRequestClose = () => {
    this.animateOut()
  }

  getInputLayoutStyle = async () => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-underscore-dangle
      this.originalInputRef.current._component.measureInWindow((left, top, width, height) => {
        resolve({ left, top, width, height })
      })
    })
  }

  render() {
    const { expanded, showContent, inputInitialStyle = { top: 0, left: 0, width: 0, height: 0 } } = this.state
    // NOTE: height and borderRadius are removed since are not intended to be used as props
    // eslint-disable-next-line no-unused-vars
    const { label, height, borderRadius, overlayColor, ...inputProps } = this.props

    // TODO: Move this logic inside other component with the Modal&Content
    const offsetY = Platform.select({ android: StatusBar.currentHeight, ios: 0 })
    const yTranslate = inputInitialStyle.top - INPUT_OFFSET_TOP

    const xTranslate = (windowWidth - inputInitialStyle.width) / 2 - inputInitialStyle.left

    const containerStyle = {
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [offsetY, offsetY - yTranslate, offsetY - yTranslate],
          }),
        },
        {
          translateX: this.animationProgress.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0, xTranslate, xTranslate],
          }),
        },
        {
          scale: this.animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, INPUT_SCALE],
          }),
        },
      ],
    }

    const overlayStyle = {
      backgroundColor: overlayColor,
      opacity: this.animationProgress.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0, BACKGROUND_OPACITY, BACKGROUND_OPACITY],
      }),
      // transform: [{ scale: this.animationProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }],
    }

    const originalInputOpacity = this.animationProgress.interpolate({
      inputRange: [0, 0.001, 1],
      outputRange: [1, 0, 0],
    })

    const labelStyle = {
      // opacity: this.animationProgress,
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [-100, -100, 0],
          }),
        },
      ],
    }

    return (
      <View style={[this.props.style, styles.overrideNonLayoutProps]}>
        {expanded && (
          <Modal
            animationType="none"
            presentationStyle="overFullScreen"
            transparent={true}
            visible={true}
            onRequestClose={this.handleRequestClose}
            supportedOrientations={SUPPORTED_ORIENTATIONS}
          >
            {showContent && (
              <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[styles.overlay, overlayStyle]} />
                <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
                <AnimatedTextInput
                  {...inputProps}
                  style={[this.props.style, styles.clonedInput, inputInitialStyle, containerStyle]}
                  ref={this.clonedInputRef}
                  onLayout={this.handleClonedInputLayout}
                />
              </View>
            )}
          </Modal>
        )}
        <AnimatedTextInput
          {...inputProps}
          style={[inputProps.style, { opacity: originalInputOpacity }]}
          onChangeText={undefined}
          ref={this.originalInputRef}
        />
        <TouchableWithoutFeedback onPress={this.animateIn}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

SpotlightTextInput.propTypes = {
  ...TextInput.propTypes,
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  label: PropTypes.string,
  style: TextInput.propTypes.style,
  overlayColor: ColorPropType,
}

SpotlightTextInput.defaultProps = {
  label: 'Label default',
  overlayColor: DEFAULT_OVERLAY_COLOR,
}

const styles = StyleSheet.create({
  clonedInput: {
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  label: {
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Avenir',
    marginTop: 50,
  },

  overrideNonLayoutProps: {
    // margin
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    // padding
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    // background
    backgroundColor: 'transparent',
  },
})

export default SpotlightTextInput
