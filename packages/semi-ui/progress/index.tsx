import React, { ReactNode, Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/progress/constants';
import '@douyinfe/semi-foundation/progress/progress.scss';
import { Animation } from '@douyinfe/semi-animation';
import { Motion } from '../_base/base';

const prefixCls = cssClasses.PREFIX;

export interface ProgressProps {
    'aria-label'?: string | undefined;
    'aria-labelledby'?: string | undefined;
    'aria-valuetext'?: string | undefined;
    className?: string;
    direction?: 'horizontal' | 'vertical';
    format?: (percent: number) => React.ReactNode;
    id?: string;
    motion?: Motion;
    orbitStroke?: string;
    percent?: number;
    showInfo?: boolean;
    size?: 'default' | 'small' | 'large';
    stroke?: string;
    strokeLinecap?: 'round' | 'square';
    strokeWidth?: number;
    style?: React.CSSProperties;
    type?: 'line' | 'circle';
    width?: number;
}

export interface ProgressState {
    percentNumber: number;
}

class Progress extends Component<ProgressProps, ProgressState> {
    static propTypes = {
        'aria-label': PropTypes.string,
        'aria-labelledby': PropTypes.string,
        'aria-valuetext': PropTypes.string,
        className: PropTypes.string,
        direction: PropTypes.oneOf(strings.directions),
        format: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        id: PropTypes.string,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        orbitStroke: PropTypes.string,
        percent: PropTypes.number,
        scale: PropTypes.number,
        showInfo: PropTypes.bool,
        size: PropTypes.oneOf(strings.sizes),
        stroke: PropTypes.string,
        strokeLinecap: PropTypes.oneOf(strings.strokeLineCap),
        strokeWidth: PropTypes.number,
        style: PropTypes.object,
        type: PropTypes.oneOf(strings.types),
        width: PropTypes.number,
    };

    static defaultProps = {
        className: '',
        direction: strings.DEFAULT_DIRECTION,
        format: (text: string): string => `${text}%`,
        motion: true,
        orbitStroke: 'var(--semi-color-fill-0)',
        percent: 0,
        showInfo: false,
        size: strings.DEFAULT_SIZE,
        stroke: 'var(--semi-color-success)',
        strokeLinecap: strings.DEFAULT_LINECAP,
        strokeWidth: 4,
        style: {},
        type: strings.DEFAULT_TYPE,
    };

    _mounted: boolean = true;

    animation: Animation;

    constructor(props: ProgressProps) {
        super(props);
        this._mounted = true;
        this.state = {
            percentNumber: this.props.percent // Specially used for animation of numbers
        };
    }
    componentDidUpdate(prevProps: ProgressProps): void {
        if (isNaN(this.props.percent) || isNaN(prevProps.percent)) {
            throw new Error('[Semi Progress]:percent can not be NaN');
            return;
        }

        if (prevProps.percent !== this.props.percent) {
            if (!this.props.motion) {
                // eslint-disable-next-line
                this.setState({ percentNumber: this.props.percent });
                return;
            }
            if (this.animation && this.animation.destroy) {
                this.animation.destroy();
            }
            this.animation = new Animation({
                from: { value: prevProps.percent },
                to: { value: this.props.percent }
            }, {
                // easing: 'cubic-bezier(0, .68, .3, 1)'
                easing: 'linear',
                duration: 300
            });
            this.animation.on('frame', (props: any) => {
                // prevent setState while component is unmounted but this timer is called
                if (this._mounted === false) {
                    return;
                }
                // let percentNumber = Number.isInteger(props.value) ? props.value : Math.floor(props.value * 100) / 100;
                const percentNumber = parseInt(props.value);
                this.setState({ percentNumber });
            });
            this.animation.on('rest', () => {
                // prevent setState while component is unmounted but this timer is called
                if (this._mounted === false) {
                    return;
                }
                this.setState({ percentNumber: this.props.percent });
            });
            this.animation.start();
        }
    }

    componentWillUnmount(): void {
        this.animation && this.animation.destroy();
        this._mounted = false;
    }

    renderCircleProgress(): ReactNode {
        const { strokeLinecap, style, className, strokeWidth, format, size, stroke, showInfo, percent, orbitStroke, id } = this.props;
        const ariaLabel = this.props['aria-label'];
        const ariaLabelledBy = this.props['aria-labelledby'];
        const ariaValueText = this.props['aria-valuetext'];
        const { percentNumber } = this.state;
        const classNames = {
            wrapper: cls(`${prefixCls}-circle`, className),
            svg: cls(`${prefixCls}-circle-ring`),
            circle: cls(`${prefixCls}-circle-ring-inner`)
        };
        const perc = this.calcPercent(percent);
        const percNumber = this.calcPercent(percentNumber);

        let width;
        if (this.props.width) {
            width = this.props.width;
        } else {
            size === strings.DEFAULT_SIZE ? width = 72 : width = 24;
        }

        // cx, cy is circle center
        const cy = width / 2;
        const cx = width / 2;
        const radius = (width - strokeWidth) / 2; // radius
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = (1 - perc / 100) * circumference; // Offset
        const strokeDasharray = `${circumference} ${circumference}`;

        const text = format(percNumber);

        return (
            <div
                id={id}
                className={classNames.wrapper} 
                style={style} 
                role='progressbar' 
                aria-valuemin={0} 
                aria-valuemax={100}
                aria-valuenow={percNumber}
                aria-labelledby={ariaLabelledBy}
                aria-label={ariaLabel}
                aria-valuetext={ariaValueText}
            >
                <svg key={size} className={classNames.svg} height={width} width={width} aria-hidden>
                    <circle
                        strokeDashoffset={0}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeLinecap={strokeLinecap}
                        fill="transparent"
                        stroke={orbitStroke}
                        r={radius}
                        cx={cx}
                        cy={cy}
                        aria-hidden
                    />
                    <circle
                        className={classNames.circle}
                        strokeDashoffset={strokeDashoffset}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeLinecap={strokeLinecap}
                        fill="transparent"
                        stroke={stroke}
                        r={radius}
                        cx={cx}
                        cy={cy}
                        aria-hidden
                    />
                </svg>
                {showInfo && size !== 'small' ? (<span className={`${prefixCls}-circle-text`}>{text}</span>) : null}
            </div>
        );
    }

    calcPercent(percent: number): number {
        let perc;
        if (percent > 100) {
            perc = 100;
        } else if (percent < 0) {
            perc = 0;
        } else {
            perc = percent;
        }
        return perc;
    }

    renderLineProgress(): ReactNode {
        const { className, style, stroke, direction, format, showInfo, size, percent, orbitStroke, id } = this.props;
        const ariaLabel = this.props['aria-label'];
        const ariaLabelledBy = this.props['aria-labelledby'];
        const ariaValueText = this.props['aria-valuetext'];
        const { percentNumber } = this.state;
        const progressWrapperCls = cls(prefixCls, className, {
            [`${prefixCls}-horizontal`]: direction === strings.DEFAULT_DIRECTION,
            [`${prefixCls}-vertical`]: direction !== strings.DEFAULT_DIRECTION,
            [`${prefixCls}-large`]: size === 'large',
        });
        const progressTrackCls = cls({
            [`${prefixCls}-track`]: true,
        });
        const innerCls = cls(`${prefixCls}-track-inner`);

        const perc = this.calcPercent(percent);
        const percNumber = this.calcPercent(percentNumber);

        const innerStyle: Record<string, any> = {
            background: stroke
        };
        if (direction === strings.DEFAULT_DIRECTION) {
            innerStyle.width = `${perc}%`;
        } else {
            innerStyle.height = `${perc}%`;
        }

        const text = format(percNumber);

        return (
            <div
                id={id}
                className={progressWrapperCls}
                style={style}
                role='progressbar'
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={perc}
                aria-labelledby={ariaLabelledBy}
                aria-label={ariaLabel}
                aria-valuetext={ariaValueText}
            >
                <div className={progressTrackCls} style={orbitStroke ? { backgroundColor: orbitStroke } : {}} aria-hidden>
                    <div className={innerCls} style={innerStyle} aria-hidden />
                </div>
                {showInfo ? <div className={`${prefixCls}-line-text`}>{text}</div> : null}
            </div>
        );
    }

    render(): ReactNode {
        const { type } = this.props;
        if (type === 'line') {
            return this.renderLineProgress();
        } else {
            return this.renderCircleProgress();
        }
    }
}

export default Progress;