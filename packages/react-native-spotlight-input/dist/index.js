var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { PureComponent } from 'react';
import { View, Animated, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, Easing, Modal, Platform, Dimensions, } from 'react-native';
const SUPPORTED_ORIENTATIONS = ['portrait', 'landscape'];
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
class AnimatedTextInputType extends TextInput {
}
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
/**
 * Potential props
 */
const DEFAULT_ANIMATION_DURATION = 350;
const DEFAULT_OVERLAY_COLOR = 'white';
const BACKGROUND_OPACITY = 1;
const INPUT_SCALE = 1;
const defaultProps = {
    overlayColor: DEFAULT_OVERLAY_COLOR,
    animationDuration: DEFAULT_ANIMATION_DURATION,
};
/**
 * SpotlightTextInput
 */
class SpotlightTextInput extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOriginalInputPress = () => __awaiter(this, void 0, void 0, function* () {
            const inputInitialStyle = yield this.getInputLayoutStyle();
            this.setState({ expanded: true, showContent: true, inputInitialStyle });
            // NOTE: animation will be performed when header layout is available
        });
        this.animateIn = () => __awaiter(this, void 0, void 0, function* () {
            const { animationDuration } = this.props;
            Animated.timing(this.animationProgress, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start(() => {
                // eslint-disable-next-line no-underscore-dangle
                this.clonedInputRef && this.clonedInputRef.current && this.clonedInputRef.current._component.focus();
            });
        });
        this.animateOut = () => {
            const { animationDuration } = this.props;
            Animated.timing(this.animationProgress, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }).start(() => {
                this.setState({ showContent: false }, () => {
                    this.setState({ expanded: false });
                });
            });
        };
        this.handleKeyboardHide = () => this.animateOut();
        this.handleRequestClose = () => {
            this.animateOut();
        };
        this.getInputLayoutStyle = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                // eslint-disable-next-line no-underscore-dangle
                this.originalInputRef.current.measureInWindow((left, top, width, height) => {
                    resolve({ left, top, width, height });
                });
            });
        });
        this.handleHeaderLayout = ({ nativeEvent: { layout: { height }, }, }) => {
            this.setState({ headerHeight: height }, this.animateIn);
        };
        this.animationProgress = new Animated.Value(0);
        this.state = {
            expanded: false,
            showContent: true,
            hideModalContent: true,
            headerHeight: 0,
        };
        this.clonedInputRef = React.createRef();
        this.originalInputRef = React.createRef();
    }
    componentDidMount() {
        const keyboardHideEvent = Platform.select({ ios: 'keyboardWillHide', android: 'keyboardDidHide' });
        this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, this.handleKeyboardHide);
    }
    componentWillUnmount() {
        this.keyboardHideListener.remove();
    }
    render() {
        const { expanded, showContent, headerHeight, inputInitialStyle = { top: 0, left: 0, width: 0, height: 0 }, } = this.state;
        // NOTE: height and borderRadius are removed since are not intended to be used as props
        // eslint-disable-next-line no-unused-vars
        const _a = this.props, { header: Header, footer: Footer, height, overlayColor } = _a, inputProps = __rest(_a, ["header", "footer", "height", "overlayColor"]);
        // TODO: Move this logic inside other component with the Modal&Content
        const yTranslate = inputInitialStyle.top - headerHeight;
        const xTranslate = (windowWidth - inputInitialStyle.width) / 2 - inputInitialStyle.left;
        const containerStyle = {
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
        };
        const overlayStyle = {
            backgroundColor: overlayColor,
            opacity: this.animationProgress.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, BACKGROUND_OPACITY, BACKGROUND_OPACITY],
            }),
        };
        const originalInputOpacity = this.animationProgress.interpolate({
            inputRange: [0, 0.001, 1],
            outputRange: [1, 0, 0],
        });
        const headerStyle = {
            transform: [
                {
                    translateY: this.animationProgress.interpolate({
                        inputRange: [0, 0.2, 1],
                        outputRange: [-headerHeight, -headerHeight, 0],
                    }),
                },
            ],
        };
        const footerTop = windowHeight - headerHeight - inputInitialStyle.height;
        const footerStyle = {
            transform: [
                {
                    translateY: this.animationProgress.interpolate({
                        inputRange: [0, 0.2, 1],
                        outputRange: [footerTop, footerTop, 0],
                    }),
                },
            ],
        };
        return (<View style={[this.props.style, styles.overrideNonLayoutProps]}>
        {expanded && (<TouchableWithoutFeedback onPress={this.handleRequestClose}>
            <Modal animationType="none" presentationStyle="overFullScreen" transparent={true} visible={true} onRequestClose={this.handleRequestClose} supportedOrientations={SUPPORTED_ORIENTATIONS}>
              {showContent && (<View style={StyleSheet.absoluteFill}>
                  <Animated.View style={[styles.overlay, overlayStyle]}/>
                  <Animated.View style={headerStyle} onLayout={this.handleHeaderLayout}>
                    {Header && <Header inputValue={this.props.value}/>}
                  </Animated.View>
                  <AnimatedTextInput {...inputProps} style={[this.props.style, styles.clonedInput, inputInitialStyle, containerStyle]} ref={this.clonedInputRef}/>

                  {Footer && (<Animated.View style={[{ marginTop: inputInitialStyle.height }, footerStyle]}>
                      <Footer inputValue={this.props.value}/>
                    </Animated.View>)}
                </View>)}
            </Modal>
          </TouchableWithoutFeedback>)}
        {!expanded && (<TextInput {...inputProps} style={[inputProps.style]} onChangeText={undefined} ref={this.originalInputRef}/>)}
        {!expanded && (<TouchableWithoutFeedback onPress={this.handleOriginalInputPress}>
            <View style={StyleSheet.absoluteFill}/>
          </TouchableWithoutFeedback>)}
      </View>);
    }
}
SpotlightTextInput.defaultProps = defaultProps;
const styles = StyleSheet.create({
    clonedInput: {
        position: 'absolute',
    },
    overlay: Object.assign({}, StyleSheet.absoluteFillObject),
    originalInputMask: {
        backgroundColor: 'red',
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
});
export default SpotlightTextInput;
