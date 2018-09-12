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
import { View, Animated, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, Modal, Platform, Dimensions, } from 'react-native';
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
    collapseOnKeyboardHide: true,
    animationConfig: {
        duration: DEFAULT_ANIMATION_DURATION,
    },
};
/**
 * SpotlightTextInput
 */
class SpotlightTextInput extends PureComponent {
    constructor(props) {
        super(props);
        this.expand = () => {
            const { animationConfig } = this.props;
            return new Promise(resolve => {
                Animated.timing(this.animationProgress, Object.assign({}, animationConfig, { toValue: 1, useNativeDriver: true })).start(() => {
                    this.clonedInputRef && this.clonedInputRef.current && this.clonedInputRef.current._component.focus();
                    resolve();
                });
            });
        };
        this.collapse = () => {
            const { animationConfig } = this.props;
            return new Promise(resolve => {
                Animated.timing(this.animationProgress, Object.assign({}, animationConfig, { toValue: 0, useNativeDriver: true })).start(() => {
                    this.setState({ showContent: false }, () => {
                        this.setState({ expanded: false }, resolve);
                    });
                });
            });
        };
        this._handleOriginalInputPress = () => __awaiter(this, void 0, void 0, function* () {
            const inputInitialStyle = yield this._getInputLayoutStyle();
            this.setState({ expanded: true, showContent: true, inputInitialStyle });
            // NOTE: animation will be performed when header layout is available
        });
        this._handleKeyboardHide = () => {
            if (this.props.collapseOnKeyboardHide && this.state.expanded) {
                this.collapse();
            }
        };
        this._handleRequestClose = () => {
            this.collapse();
        };
        this._getInputLayoutStyle = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.originalInputRef.current._component.measureInWindow((left, top, width, height) => resolve({ left, top, width, height }));
            });
        });
        this._handleHeaderLayout = ({ nativeEvent: { layout: { height }, }, }) => {
            this.setState({ headerHeight: height }, this.expand);
        };
        this.animationProgress = new Animated.Value(0);
        this.state = {
            expanded: false,
            showContent: false,
            hideModalContent: true,
            headerHeight: 0,
        };
        this.clonedInputRef = React.createRef();
        this.originalInputRef = React.createRef();
    }
    componentDidMount() {
        const keyboardHideEvent = Platform.select({ ios: 'keyboardWillHide', android: 'keyboardDidHide' });
        this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, this._handleKeyboardHide);
    }
    componentWillUnmount() {
        this.keyboardHideListener.remove();
    }
    render() {
        const { expanded, showContent, headerHeight, inputInitialStyle = { top: 0, left: 0, width: 0, height: 0 }, } = this.state;
        const _a = this.props, { header: Header, footer: Footer, overlayColor } = _a, inputProps = __rest(_a, ["header", "footer", "overlayColor"]);
        const yTranslate = inputInitialStyle.top - headerHeight;
        const xTranslate = (windowWidth - inputInitialStyle.width) / 2 - inputInitialStyle.left;
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
        };
        const overlayStyle = {
            backgroundColor: overlayColor,
            opacity: this.animationProgress.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, BACKGROUND_OPACITY, BACKGROUND_OPACITY],
            }),
        };
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
        {expanded && (<Modal animationType="none" presentationStyle="overFullScreen" transparent={true} visible={true} onRequestClose={this._handleRequestClose} supportedOrientations={SUPPORTED_ORIENTATIONS}>
            {showContent && (<View style={StyleSheet.absoluteFill}>
                <TouchableWithoutFeedback onPress={this._handleRequestClose}>
                  <Animated.View style={[styles.overlay, overlayStyle]}/>
                </TouchableWithoutFeedback>
                <Animated.View style={headerStyle} onLayout={this._handleHeaderLayout}>
                  {Header && <Header inputValue={this.props.value}/>}
                </Animated.View>
                <AnimatedTextInput {...inputProps} style={[this.props.style, styles.clonedInput, inputInitialStyle, inputStyle]} ref={this.clonedInputRef}/>

                {Footer && (<Animated.View style={[{ marginTop: inputInitialStyle.height }, footerStyle]}>
                    <Footer inputValue={this.props.value}/>
                  </Animated.View>)}
              </View>)}
          </Modal>)}

        <AnimatedTextInput {...inputProps} style={[
            inputProps.style,
            styles.originalInput,
            {
                opacity: this.animationProgress.interpolate({
                    inputRange: [0, 0.001, 1],
                    outputRange: [1, 0, 0],
                }),
            },
        ]} onChangeText={undefined} ref={this.originalInputRef}/>

        {!expanded && (<TouchableWithoutFeedback onPress={this._handleOriginalInputPress}>
            <View style={StyleSheet.absoluteFill}/>
          </TouchableWithoutFeedback>)}
      </View>);
    }
}
SpotlightTextInput.defaultProps = defaultProps;
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
    overlay: Object.assign({}, StyleSheet.absoluteFillObject),
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
