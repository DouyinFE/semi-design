import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { strings } from '@douyinfe/semi-foundation/typography/constants';
import Base from './base';
import { Ellipsis, TypographyBaseSize, TypographyBaseType, OmitTypographyProps } from './interface';
import { CopyableConfig, LinkType } from './title';

type OmitTextProps = OmitTypographyProps;

export interface TextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, OmitTextProps> {
    children?: React.ReactNode;
    className?: string;
    code?: boolean;
    component?: React.ElementType;
    copyable?: CopyableConfig | boolean;
    delete?: boolean;
    disabled?: boolean;
    ellipsis?: Ellipsis | boolean;
    icon?: React.ReactNode | string;
    link?: LinkType;
    mark?: boolean;
    size?: TypographyBaseSize;
    strong?: boolean;
    style?: React.CSSProperties;
    type?: TypographyBaseType;
    underline?: boolean
}

export default class Text extends PureComponent<TextProps> {
    static propTypes = {
        copyable: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        delete: PropTypes.bool,
        disabled: PropTypes.bool,
        icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        ellipsis: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        mark: PropTypes.bool,
        underline: PropTypes.bool,
        link: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        strong: PropTypes.bool,
        type: PropTypes.oneOf(strings.TYPE),
        size: PropTypes.oneOf(strings.SIZE),
        style: PropTypes.object,
        className: PropTypes.string,
        code: PropTypes.bool,
        component: PropTypes.string,
    };

    static defaultProps = {
        copyable: false,
        delete: false,
        disabled: false,
        icon: '',
        // editable: false,
        ellipsis: false,
        mark: false,
        underline: false,
        strong: false,
        link: false,
        type: 'primary',
        style: {},
        size: 'normal',
        className: '',
    };

    render() {
        return <Base component={'span'} {...this.props} />;
    }
}
