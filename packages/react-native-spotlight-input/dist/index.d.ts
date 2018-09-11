import React, { PureComponent } from 'react';
import { Animated, TextInput, EmitterSubscription, TextInputProps, LayoutChangeEvent } from 'react-native';
declare class AnimatedTextInputType extends TextInput {
    _component: TextInput;
}
declare type InputLayout = {
    top: number;
    left: number;
    width?: number;
    height?: number;
};
export interface SpotlightTextInputHeaderProps {
    inputValue: string;
}
declare type SpotlightTextInputAnimationConfig = Partial<Animated.TimingAnimationConfig> & {
    toValue: never;
};
export interface SpotlightTextInputProps extends TextInputProps {
    header?: typeof React.Component;
    footer?: typeof React.Component;
    overlayColor?: string;
    animationConfig?: SpotlightTextInputAnimationConfig;
    style?: any;
}
interface State {
    expanded: boolean;
    showContent: boolean;
    hideModalContent: boolean;
    inputInitialStyle?: InputLayout;
    headerHeight: number;
}
/**
 * SpotlightTextInput
 */
declare class SpotlightTextInput extends PureComponent<SpotlightTextInputProps, State> {
    animationProgress: Animated.Value;
    clonedInputRef: React.RefObject<AnimatedTextInputType>;
    originalInputRef: React.RefObject<AnimatedTextInputType>;
    keyboardHideListener: EmitterSubscription;
    static defaultProps: {
        overlayColor: string;
        animationConfig: {
            duration: number;
        };
    };
    constructor(props: SpotlightTextInputProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleOriginalInputPress: () => Promise<void>;
    animateIn: () => Promise<void>;
    animateOut: () => void;
    handleKeyboardHide: () => void;
    handleRequestClose: () => void;
    getInputLayoutStyle: () => Promise<InputLayout>;
    handleHeaderLayout: ({ nativeEvent: { layout: { height }, }, }: LayoutChangeEvent) => void;
    render(): JSX.Element;
}
export default SpotlightTextInput;
