import React, { PureComponent, RefObject } from 'react'
import {
  View,
  Animated,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  Dimensions,
  EmitterSubscription,
  ModalPropsIOS,
  TextInputProps,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native'

const SUPPORTED_ORIENTATIONS: ModalPropsIOS['supportedOrientations'] = ['portrait', 'landscape']
const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

class AnimatedTextInputType extends TextInput {
  _component: TextInput
}

const AnimatedTextInput: typeof AnimatedTextInputType = Animated.createAnimatedComponent(TextInput)

/**
 * Potential props
 */

const DEFAULT_ANIMATION_DURATION = 350
const DEFAULT_OVERLAY_COLOR = 'white'
const BACKGROUND_OPACITY = 1
const INPUT_SCALE = 1

type InputLayout = {
  top: number
  left: number
  width?: number
  height?: number
}

export interface SpotlightTextInputHeaderProps {
  inputValue: string
}

type SpotlightTextInputAnimationConfig = Partial<Animated.TimingAnimationConfig> & {
  toValue: never
}

export interface SpotlightTextInputProps extends TextInputProps {
  header?: React.SFC<SpotlightTextInputHeaderProps> | React.ComponentClass<SpotlightTextInputHeaderProps>
  footer?: React.SFC<SpotlightTextInputHeaderProps> | React.ComponentClass<SpotlightTextInputHeaderProps>
  overlayColor?: string
  animationConfig?: SpotlightTextInputAnimationConfig
  collapseOnKeyboardHide?: boolean
  // TODO: replace with proper type
  style?: any
}

const defaultProps = {
  overlayColor: DEFAULT_OVERLAY_COLOR,
  collapseOnKeyboardHide: true,
  animationConfig: {
    duration: DEFAULT_ANIMATION_DURATION,
  },
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

class SpotlightTextInput extends PureComponent<SpotlightTextInputProps, State> {
  animationProgress: Animated.Value
  clonedInputRef: React.RefObject<AnimatedTextInputType>
  originalInputRef: React.RefObject<AnimatedTextInputType>
  keyboardHideListener: EmitterSubscription

  static defaultProps = defaultProps

  constructor(props: SpotlightTextInputProps) {
    super(props)
    this.animationProgress = new Animated.Value(0)

    this.state = {
      expanded: false,
      showContent: false,
      hideModalContent: true,
      headerHeight: 0,
    }

    this.clonedInputRef = React.createRef()
    this.originalInputRef = React.createRef()
  }

  componentDidMount() {
    const keyboardHideEvent = Platform.select({ ios: 'keyboardWillHide', android: 'keyboardDidHide' })
    this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, this._handleKeyboardHide)
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }

  expand = () => {
    const { animationConfig } = this.props

    return new Promise(resolve => {
      Animated.timing(this.animationProgress, {
        ...animationConfig,
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        this.clonedInputRef && this.clonedInputRef.current && this.clonedInputRef.current._component.focus()
        resolve()
      })
    })
  }

  collapse = () => {
    const { animationConfig } = this.props

    return new Promise(resolve => {
      Animated.timing(this.animationProgress, {
        ...animationConfig,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ showContent: false }, () => {
          this.setState({ expanded: false }, resolve)
        })
      })
    })
  }

  _handleOriginalInputPress = async () => {
    const inputInitialStyle: InputLayout = await this._getInputLayoutStyle()
    this.setState({ expanded: true, showContent: true, inputInitialStyle })
    // NOTE: animation will be performed when header layout is available
  }

  _handleKeyboardHide = () => {
    if (this.props.collapseOnKeyboardHide && this.state.expanded) {
      this.collapse()
    }
  }

  _handleRequestClose = () => {
    this.collapse()
  }

  _getInputLayoutStyle = async (): Promise<InputLayout> => {
    return new Promise(resolve => {
      this.originalInputRef.current._component.measureInWindow((left, top, width, height) =>
        resolve({ left, top, width, height })
      )
    }) as Promise<InputLayout>
  }

  _handleHeaderLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    this.setState({ headerHeight: height }, this.expand)
  }

  render() {
    const {
      expanded,
      showContent,
      headerHeight,
      inputInitialStyle = { top: 0, left: 0, width: 0, height: 0 },
    } = this.state
    const { header: Header, footer: Footer, overlayColor, ...inputProps } = this.props

    const yTranslate = inputInitialStyle.top - headerHeight
    const xTranslate = (windowWidth - inputInitialStyle.width) / 2 - inputInitialStyle.left

    const inputStyle = {
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0, -yTranslate, -yTranslate],
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

    const headerStyle = {
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [-headerHeight, -headerHeight, 0],
          }),
        },
      ],
    }

    const footerTop = windowHeight - headerHeight - inputInitialStyle.height

    const footerStyle = {
      transform: [
        {
          translateY: this.animationProgress.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [footerTop, footerTop, 0],
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
            onRequestClose={this._handleRequestClose}
            supportedOrientations={SUPPORTED_ORIENTATIONS}
          >
            {showContent && (
              <View style={StyleSheet.absoluteFill}>
                <TouchableWithoutFeedback onPress={this._handleRequestClose}>
                  <Animated.View style={[styles.overlay, overlayStyle]} />
                </TouchableWithoutFeedback>
                <Animated.View style={headerStyle} onLayout={this._handleHeaderLayout}>
                  {Header && <Header inputValue={this.props.value} />}
                </Animated.View>
                <AnimatedTextInput
                  {...inputProps}
                  style={[this.props.style, styles.clonedInput, inputInitialStyle, inputStyle]}
                  ref={this.clonedInputRef}
                />

                {Footer && (
                  <Animated.View style={[{ marginTop: inputInitialStyle.height }, footerStyle]}>
                    <Footer inputValue={this.props.value} />
                  </Animated.View>
                )}
              </View>
            )}
          </Modal>
        )}

        <AnimatedTextInput
          {...inputProps}
          style={[
            inputProps.style,
            styles.originalInput,
            {
              opacity: this.animationProgress.interpolate({
                inputRange: [0, 0.001, 1],
                outputRange: [1, 0, 0],
              }),
            },
          ]}
          onChangeText={undefined}
          ref={this.originalInputRef}
        />

        {!expanded && (
          <TouchableWithoutFeedback onPress={this._handleOriginalInputPress}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  originalInput: {
    // position
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

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
