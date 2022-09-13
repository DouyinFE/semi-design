import React, { CSSProperties, ReactNode } from 'react';
import { isEqual, noop } from "lodash";


interface AnimationEventsNeedBind {
    onAnimationStart: (e: React.AnimationEvent) => void
    onAnimationEnd: (e: React.AnimationEvent) => void
}

interface AnimationProps {
    startClassName?: string;
    endClassName?: string;
    children: ({}: {
        animationClassName: string,
        animationStyle: CSSProperties,
        animationEventsNeedBind: AnimationEventsNeedBind
    }) => ReactNode
    animationState: "enter" | "leave"
    onAnimationEnd?:()=>void;
    onAnimationStart?:()=>void;
}

interface AnimationState {
    currentClassName: string
    extraStyle: CSSProperties
}


class CSSAnimation extends React.Component<AnimationProps, AnimationState> {
    constructor(props) {
        super(props);
        this.state = {
            currentClassName: this.props.startClassName,
            extraStyle: {}
        };
        console.log("===>", this.props);
    }

    componentDidUpdate(prevProps: Readonly<AnimationProps>, prevState: Readonly<AnimationState>, snapshot?: any) {
        const changedKeys = Object.keys(this.props).filter(key => !isEqual(this.props[key], prevProps[key]));
        console.log('changedKeys', changedKeys, prevProps, this.props);
        if (changedKeys.includes("animationState")) {
            // if (this.props.animationState === "enter") {
            //     this.setState({
            //         currentClassName: this.props.startClassName,
            //         extraStyle: {}
            //     }, this.props.onAnimationStart ?? noop);
            // } else {
            //     this.setState({
            //         currentClassName: this.props.endClassName,
            //         extraStyle: {}
            //     }, this.props.onAnimationEnd ?? noop);
            // }
        }
        if (changedKeys.includes("startClassName")){
            this.setState({
                currentClassName: this.props.startClassName,
                extraStyle: {}
            }, this.props.onAnimationStart ?? noop);
        }

    }

    handleAnimationStart = () => {
        this.props.onAnimationStart();
    }


    handleAnimationEnd = () => {
        this.setState({
            currentClassName: this.props.endClassName,
            extraStyle: {}
        }, ()=>{
            this.props.onAnimationEnd();
        });
    }


    render() {
        console.log("mount", this.state.currentClassName);
        return this.props.children({
            animationClassName: this.state.currentClassName ?? "",
            animationStyle: this.state.extraStyle,
            animationEventsNeedBind: {
                onAnimationStart: this.handleAnimationStart,
                onAnimationEnd: this.handleAnimationEnd
            }
        });
    }

}

export default CSSAnimation;
