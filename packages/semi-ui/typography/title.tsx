import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { strings } from '@douyinfe/semi-foundation/typography/constants';
import Base from './base';
import { Ellipsis, TypographyBaseType, OmitTypographyProps } from './interface';
import { ArrayElement } from '@douyinfe/semi-foundation/utils/type';

type OmitTitleProps = OmitTypographyProps;

export interface CopyableConfig {
    content?: string;
    copyTip?: React.ReactNode;
    successTip?: React.ReactNode;
    onCopy?(e: React.MouseEvent, content: string, res: boolean): void;
}

export type LinkType = React.AnchorHTMLAttributes<HTMLAnchorElement> | boolean;

export interface TitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, OmitTitleProps>{
    className?: string;
    component?: React.ElementType;
    copyable?: CopyableConfig | boolean;
    delete?: boolean;
    disabled?: boolean;
    ellipsis?: Ellipsis | boolean;
    heading?: ArrayElement<typeof strings.HEADING>;
    link?: LinkType;
    mark?: boolean;
    strong?: boolean;
    style?: React.CSSProperties;
    type?: TypographyBaseType;
    underline?: boolean;
}
export default class Title extends PureComponent<TitleProps> {
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
        heading: PropTypes.oneOf(strings.HEADING),
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
        heading: 1,
        style: {},
        className: '',
    };

    render() {
        const { heading, ...rest } = this.props;
        const component = strings.HEADING.indexOf(heading) !== -1 ? `h${heading}` : 'h1';
        // Passing headings to support custom components
        return <Base component={component as React.ElementType} heading={component} {...rest} />;
    }
}
