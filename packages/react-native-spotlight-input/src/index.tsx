import React, { PureComponent, RefObject } from 'react'
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
  EmitterSubscription,
  ModalPropsIOS,
  TextInputProps,
  LayoutChangeEvent,
} from 'react-native'

const SUPPORTED_ORIENTATIONS: ModalPropsIOS['supportedOrientations'] = ['portrait', 'landscape']
const windowWidth = Dimensions.get('window').width

class AnimatedTextInputType extends TextInput {
  _component: TextInput
}

const AnimatedTextInput: typeof AnimatedTextInputType = Animated.createAnimatedComponent(TextInput)

/**
 * Potential props
 */

const ANIMATION_DURATION = 500
const DEFAULT_OVERLAY_COLOR = 'white'
const BACKGROUND_OPACITY = 1
const INPUT_SCALE = 1

type InputLayout = {
  top: number
  left: number
  width: number
  height: number
}

interface Props extends TextInputProps {
  height?: number
  header?: Element | React.Component
  footer?: Element | React.Component
  overlayColor?: string
  // TODO: remove this any and fix the typing issues
  style?: any
}

const defaultProps = {
  overlayColor: DEFAULT_OVERLAY_COLOR,
}

interface State {
  expanded: boolean
  showContent: boolean
  hideModalContent: boolean
  inputInitialStyle?: InputLayout
  headerHeight: number
}

/**
 * SpotlightTextInput
 */

class SpotlightTextInput extends PureComponent<Props, State> {
  animationProgress: Animated.Value
  clonedInputRef: React.RefObject<AnimatedTextInputType>
  originalInputRef: React.RefObject<AnimatedTextInputType>
  keyboardHideListener: EmitterSubscription

  static defaultProps = defaultProps

  constructor(props: Props) {
    super(props)
    this.animationProgress = new Animated.Value(0)

    this.state = {
      expanded: false,
      showContent: true,
      hideModalContent: true,
      headerHeight: 0,
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

  handleOriginalInputPress = async () => {
    const inputInitialStyle: InputLayout = await this.getInputLayoutStyle()
    this.setState({ expanded: true, showContent: true, inputInitialStyle })
    // NOTE: animation will be performed when header layout is available
  }

  animateIn = async () => {
    Animated.timing(this.animationProgress, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // eslint-disable-next-line no-underscore-dangle
      this.clonedInputRef && this.clonedInputRef.current && this.clonedInputRef.current._component.focus()
    })
  }

  animateOut = () => {
    Animated.timing(this.animationProgress, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      // easing: Easing.in,
    }).start(() => {
      this.setState({ showContent: false }, () => {
        this.setState({ expanded: false })
      })
    })
  }

  handleKeyboardHide = () => this.animateOut()

  handleRequestClose = () => {
    this.animateOut()
  }

  getInputLayoutStyle = async (): Promise<InputLayout> => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-underscore-dangle
      this.originalInputRef.current._component.measureInWindow((left, top, width, height) => {
        resolve({ left, top, width, height })
      })
    }) as Promise<InputLayout>
  }

  handleHeaderLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    this.setState({ headerHeight: height }, this.animateIn)
  }

  render() {
    const {
      expanded,
      showContent,
      headerHeight,
      inputInitialStyle = { top: 0, left: 0, width: 0, height: 0 },
    } = this.state
    // NOTE: height and borderRadius are removed since are not intended to be used as props
    // eslint-disable-next-line no-unused-vars
    const { header, height, overlayColor, ...inputProps } = this.props

    // TODO: Move this logic inside other component with the Modal&Content
    const offsetY = Platform.select({ android: StatusBar.currentHeight, ios: 0 })
    const yTranslate = inputInitialStyle.top - headerHeight

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
          scaleX: this.animationProgress.interpolate({
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
    }

    const originalInputOpacity = this.animationProgress.interpolate({
      inputRange: [0, 0.001, 1],
      outputRange: [1, 0, 0],
    })

    const headerStyle = {
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [-headerHeight, -headerHeight, 0],
          }),
        },
      ],
    }

    return (
      <View style={[this.props.style, styles.overrideNonLayoutProps]}>
        {expanded && (
          <TouchableWithoutFeedback onPress={this.handleRequestClose}>
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
                  <Animated.View style={headerStyle} onLayout={this.handleHeaderLayout}>
                    {header}
                  </Animated.View>
                  <AnimatedTextInput
                    {...inputProps}
                    style={[this.props.style, styles.clonedInput, inputInitialStyle, containerStyle]}
                    ref={this.clonedInputRef}
                  />
                </View>
              )}
            </Modal>
          </TouchableWithoutFeedback>
        )}
        <AnimatedTextInput
          {...inputProps}
          style={[inputProps.style, { opacity: originalInputOpacity }]}
          onChangeText={undefined}
          ref={this.originalInputRef}
        />
        <TouchableWithoutFeedback onPress={this.handleOriginalInputPress}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  clonedInput: {
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
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
