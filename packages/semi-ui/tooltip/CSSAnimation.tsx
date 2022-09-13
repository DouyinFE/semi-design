import React, { CSSProperties, ReactNode } from 'react';
import { isEqual } from "lodash";


interface AnimationEventsNeedBind {
    onAnimationStart: (e: AnimationEvent) => void
    onAnimationEnd: (e: AnimationEvent) => void
}

interface AnimationProps {
    startClassName: string;
    endClassName: string;
    children: ({}: {
        className: string,
        style: CSSProperties,
        animationEventsNeedBind: AnimationEventsNeedBind
    }) => ReactNode
    animationState: "enter" | "leave"
}

interface AnimationState {
    currentClassName: string
    extraStyle: CSSProperties
}


class Animation extends React.Component<AnimationProps, AnimationState> {
    constructor(props) {
        super(props);
        this.state = {
            currentClassName: "",
            extraStyle: {}
        };
    }

    componentDidUpdate(prevProps: Readonly<AnimationProps>, prevState: Readonly<AnimationState>, snapshot?: any) {
        const changedKeys = Object.keys(this.props).filter(key => isEqual(this.props[key], prevProps[key]));
        if ("state" in changedKeys) {
            if (this.props.animationState === "enter") {
                this.setState({
                    currentClassName: this.props.startClassName,
                    extraStyle: {}
                });
            } else {
                this.setState({
                    currentClassName: this.props.endClassName,
                    extraStyle: {}
                });
            }
        }

    }

    handleAnimationStart = () => {
        this.setState({
            currentClassName: this.props.startClassName,
            extraStyle: {}
        });
    }


    handleAnimationEnd = () => {
        this.setState({
            currentClassName: this.props.endClassName,
            extraStyle: {}
        });
    }


    render() {
        return this.props.children({
            className: this.state.currentClassName,
            style: this.state.extraStyle,
            animationEventsNeedBind: {
                onAnimationStart: this.handleAnimationStart,
                onAnimationEnd: this.handleAnimationEnd
            }
        });
    }

}

export default Animation;
