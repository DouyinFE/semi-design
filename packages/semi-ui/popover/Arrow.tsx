import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get } from 'lodash';
import { numbers, cssClasses, strings } from '@douyinfe/semi-foundation/popover/constants';

export interface ArrowProps {
    position?: string;
    className?: string;
    arrowStyle?: React.CSSProperties;
    popStyle?: React.CSSProperties
}

const Arrow: React.FC<ArrowProps> = (props = {}) => {
    const { position = '', className, arrowStyle, popStyle, ...rest } = props;
    const isVertical = position.indexOf('top') === 0 || position.indexOf('bottom') === 0;
    const cls = classnames(className, cssClasses.ARROW);

    const borderOpacity = get(arrowStyle, 'borderOpacity', strings.DEFAULT_ARROW_STYLE.borderOpacity);
    const bgColor = get(
        arrowStyle,
        'backgroundColor',
        get(popStyle, 'backgroundColor', strings.DEFAULT_ARROW_STYLE.backgroundColor)
    );
    const borderColor = get(
        arrowStyle,
        'borderColor',
        get(popStyle, 'borderColor', strings.DEFAULT_ARROW_STYLE.borderColor)
    );

    const wrapProps = {
        ...rest,
        width: numbers.ARROW_BOUNDING.width,
        height: numbers.ARROW_BOUNDING.height,
        xmlns: 'http://www.w3.org/2000/svg',
        className: cls,
    };

    return isVertical ? (
        <svg {...wrapProps}>
            <path
                d="M0 0.5L0 1.5C4 1.5, 5.5 3, 7.5 5S10,8 12,8S14.5 7, 16.5 5S20,1.5 24,1.5L24 0.5L0 0.5z"
                fill={borderColor}
                opacity={borderOpacity}
            />
            <path d="M0 0L0 1C4 1, 5.5 2, 7.5 4S10,7 12,7S14.5  6, 16.5 4S20,1 24,1L24 0L0 0z" fill={bgColor} />
        </svg>
    ) : (
        <svg {...wrapProps}>
            <path
                d="M0.5 0L1.5 0C1.5 4, 3 5.5, 5 7.5S8,10 8,12S7 14.5, 5 16.5S1.5,20 1.5,24L0.5 24L0.5 0z"
                fill={borderColor}
                opacity={borderOpacity}
            />
            <path d="M0 0L1 0C1 4, 2 5.5, 4 7.5S7,10 7,12S6 14.5, 4 16.5S1,20 1,24L0 24L0 0z" fill={bgColor} />
        </svg>
    );
};

Arrow.propTypes = {
    position: PropTypes.string,
    className: PropTypes.string,
    arrowStyle: PropTypes.object,
    popStyle: PropTypes.object,
};
export default Arrow;