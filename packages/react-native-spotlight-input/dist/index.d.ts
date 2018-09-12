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
    header?: React.SFC<SpotlightTextInputHeaderProps> | React.ComponentClass<SpotlightTextInputHeaderProps>;
    footer?: React.SFC<SpotlightTextInputHeaderProps> | React.ComponentClass<SpotlightTextInputHeaderProps>;
    overlayColor?: string;
    animationConfig?: SpotlightTextInputAnimationConfig;
    collapseOnKeyboardHide?: boolean;
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
        collapseOnKeyboardHide: boolean;
        animationConfig: {
            duration: number;
        };
    };
    constructor(props: SpotlightTextInputProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    expand: () => Promise<{}>;
    collapse: () => Promise<{}>;
    _handleOriginalInputPress: () => Promise<void>;
    _handleKeyboardHide: () => void;
    _handleRequestClose: () => void;
    _getInputLayoutStyle: () => Promise<InputLayout>;
    _handleHeaderLayout: ({ nativeEvent: { layout: { height }, }, }: LayoutChangeEvent) => void;
    render(): JSX.Element;
}
export default SpotlightTextInput;
