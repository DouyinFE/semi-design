import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes, { string } from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/highlight/constants';
import { getHighLightTextHTML } from '../_utils/index';
import '@douyinfe/semi-foundation/highlight/highlight.scss';

export interface HighlightProps {
    autoEscape?: boolean;
    caseSensitive?: boolean;
    sourceString?: string;
    searchWords?: Array<string>;
    highlightStyle?: React.CSSProperties;
    highlightClassName?: string;
    component?: string
}

const prefixCls = cssClasses.PREFIX;

class Highlight extends PureComponent<HighlightProps> {

    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        autoEscape: PropTypes.bool,
        caseSensitive: PropTypes.bool,
        sourceString: PropTypes.string,
        searchWords: PropTypes.arrayOf(PropTypes.string),
        highlightStyle: PropTypes.object,
        highlightClassName: PropTypes.string,
        component: PropTypes.string
    };

    static defaultProps = {
        component: 'mark',
        autoEscape: true,
        caseSensitive: false,
        sourceString: '',
    };

    render() {
        const {
            searchWords,
            sourceString,
            component,
            highlightClassName,
            highlightStyle,
            caseSensitive,
            autoEscape,
        } = this.props;

        const tagCls = cls({
            [`${prefixCls}-tag`]: true,
        }, highlightClassName);

        const option = {
            highlightTag: component,
            highlightClassName: tagCls,
            highlightStyle,
            caseSensitive,
            autoEscape,
        };

        return (
            getHighLightTextHTML({ sourceString, searchWords, option })
        );
    }
}

export default Highlight;
