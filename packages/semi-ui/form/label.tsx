import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/form/constants';

const prefixCls = cssClasses.PREFIX;

export interface LabelProps {
    id?: string;
    /** Whether to display the required * symbol */
    required?: boolean;
    /** Content of label */
    text?: React.ReactNode;
    disabled?: boolean;
    /** Used to configure the htmlFor attribute of the label tag */
    name?: string;
    /** text-align of label */
    align?: string;
    /** width of label */
    width?: number | string;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode | undefined;
    extra?: React.ReactNode;
}

export default class Label extends PureComponent<LabelProps> {
    static defaultProps = {
        required: false,
        name: '',
        align: 'left',
        className: ''
    };

    static propTypes = {
        id: PropTypes.string,
        children: PropTypes.node,
        required: PropTypes.bool,
        text: PropTypes.node,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        align: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        style: PropTypes.object,
        className: PropTypes.string,
        extra: PropTypes.node,
    };

    render() {
        const { children, required, text, disabled, name, width, align, style, className, extra, id } = this.props;

        const labelCls = classNames(className, {
            [`${prefixCls}-field-label`]: true,
            [`${prefixCls}-field-label-left`]: align === 'left',
            [`${prefixCls}-field-label-right`]: align === 'right',
            [`${prefixCls}-field-label-required`]: required,
            [`${prefixCls}-field-label-disabled`]: disabled,
            [`${prefixCls}-field-label-with-extra`]: extra,
        });
        const labelStyle = style ? style : {};
        width ? labelStyle.width = width : null;

        const textContent = (
            <div className={`${prefixCls}-field-label-text`}>
                {typeof text !== 'undefined' ? text : children}
            </div>
        );

        const contentWithExtra = (
            <>
                {textContent}
                <div className={`${prefixCls}-field-label-extra`}>{extra}</div>
            </>
        );

        return (
            <label className={labelCls} htmlFor={name} style={labelStyle} id={id}>
                {extra ? contentWithExtra : textContent}
            </label>
        );
    }
}
