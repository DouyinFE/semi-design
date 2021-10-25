import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { strings, cssClasses } from '@douyinfe/semi-foundation/typography/constants';
import Base from './base';
import {
    Ellipsis,
    TypographyBaseSize,
    TypographyBaseSpacing,
    TypographyBaseType,
    OmitTypographyProps
} from './interface';
import { CopyableConfig, LinkType } from './title';


type OmitParagraphProps = OmitTypographyProps;

export interface ParagraphProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, OmitParagraphProps>{
    className?: string;
    component?: React.ElementType;
    copyable?: CopyableConfig | boolean;
    delete?: boolean;
    disabled?: boolean;
    ellipsis?: Ellipsis | boolean;
    link?: LinkType;
    mark?: boolean;
    size?: TypographyBaseSize;
    spacing?: TypographyBaseSpacing;
    strong?: boolean;
    style?: React.CSSProperties;
    type?: TypographyBaseType;
    underline?: boolean;
}

const prefixCls = cssClasses.PREFIX;
export default class Paragraph extends PureComponent<ParagraphProps> {
    static propTypes = {
        copyable: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        delete: PropTypes.bool,
        disabled: PropTypes.bool,
        // editable: PropTypes.bool,
        ellipsis: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        mark: PropTypes.bool,
        link: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        underline: PropTypes.bool,
        strong: PropTypes.bool,
        type: PropTypes.oneOf(strings.TYPE),
        size: PropTypes.oneOf(strings.SIZE),
        spacing: PropTypes.oneOf(strings.SPACING),
        style: PropTypes.object,
        className: PropTypes.string,
        component: PropTypes.string,
    };

    static defaultProps = {
        copyable: false,
        delete: false,
        disabled: false,
        // editable: false,
        ellipsis: false,
        mark: false,
        underline: false,
        strong: false,
        link: false,
        type: 'primary',
        size: 'normal',
        spacing: 'normal',
        style: {},
        className: '',
    };

    render() {
        const { className } = this.props;
        const paragraphCls = cls(className, `${prefixCls}-paragraph`);
        return <Base component={'p'} {...this.props} className={paragraphCls} />;
    }
}
