import React, { CSSProperties, ReactNode } from 'react';
import { isEqual, noop } from "lodash";


interface AnimationEventsNeedBind {
    onAnimationStart?: (e: React.AnimationEvent) => void
    onAnimationEnd?: (e: React.AnimationEvent) => void

    [key: string]: (e: any) => void;
}

interface AnimationProps {
    startClassName?: string;
    endClassName?: string;
    children: ({}: {
        animationClassName: string,
        animationStyle: CSSProperties,
        animationEventsNeedBind: AnimationEventsNeedBind,
        isAnimating: boolean
    }) => ReactNode
    animationState: "enter" | "leave"
    onAnimationEnd?: () => void;
    onAnimationStart?: () => void;
    motion?: boolean;
    replayKey?: string;
}

interface AnimationState {
    currentClassName: string
    extraStyle: CSSProperties,
    isAnimating: boolean
}


class CSSAnimation extends React.Component<AnimationProps, AnimationState> {

    static defaultProps = {
        motion: true,
        replayKey: "",
    }

    constructor(props) {
        super(props);

        this.state = {
            currentClassName: this.props.startClassName,
            extraStyle: {},
            isAnimating: true
        };
    }


    componentDidUpdate(prevProps: Readonly<AnimationProps>, prevState: Readonly<AnimationState>, snapshot?: any) {
        const changedKeys = Object.keys(this.props).filter(key => !isEqual(this.props[key], prevProps[key]));
        if (changedKeys.includes("animationState")) {
        }
        if (changedKeys.includes("startClassName") || changedKeys.includes('replayKey') || changedKeys.includes("motion")) {
            this.setState({
                currentClassName: this.props.startClassName,
                extraStyle: {},
                isAnimating: true
            }, () => {
                this.props.onAnimationStart?.();
                if (!this.props.motion) {
                    this.props.onAnimationEnd?.();
                }
            });
        }


    }

    handleAnimationStart = () => {
        this.props.onAnimationStart?.();
    }


    handleAnimationEnd = () => {
        this.setState({
            currentClassName: this.props.endClassName,
            extraStyle: {},
            isAnimating: false
        }, () => {
            this.props.onAnimationEnd?.();
        });
    }


    render() {
        if (this.props.motion) {
            return this.props.children({
                animationClassName: this.state.currentClassName ?? "",
                animationStyle: this.state.extraStyle,
                animationEventsNeedBind: {
                    onAnimationStart: this.handleAnimationStart,
                    onAnimationEnd: this.handleAnimationEnd
                },
                isAnimating: this.state.isAnimating
            });
        } else {
            return this.props.children({
                animationClassName: "",
                animationStyle: {},
                animationEventsNeedBind: {},
                isAnimating: this.state.isAnimating
            });
        }
    }
}


// const mergeAnimationFunction = (eventHandleFunctions: AnimationEventsNeedBind[]) => {
//     //merge function in objects
//     const mergedFunction = {};
//     eventHandleFunctions.forEach(eventHandleFunction => {
//         Object.keys(eventHandleFunction).forEach(key => {
//             if (mergedFunction[key]) {
//                 const oldFunction = mergedFunction[key];
//                 mergedFunction[key] = (e) => {
//                     eventHandleFunction[key](e);
//                     oldFunction(e);
//                 };
//             } else {
//                 mergedFunction[key] = eventHandleFunction[key];
//             }
//         });
//     });
//     return mergedFunction;
// };

// export { mergeAnimationFunction };
export default CSSAnimation;
