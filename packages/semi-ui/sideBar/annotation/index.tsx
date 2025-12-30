import React from 'react';
import cls from 'classnames';
import BaseComponent from '../../_base/baseComponent';
import PropTypes from 'prop-types';
import Container from '../container';
import Content from './content';
import type { ContentProps } from './content';
import { pick } from 'lodash';
import { ContainerReactProps } from '../interface';
import { cssClasses } from '@douyinfe/semi-foundation/sidebar/constants';
import LocaleConsumer from '../../locale/localeConsumer';
import { Locale } from '../../locale/interface';

const prefixCls = cssClasses.ANNOTATION;

interface AnnotationProps extends ContainerReactProps, ContentProps {}

interface AnnotationState {}

class Annotation extends BaseComponent<AnnotationProps, AnnotationState> {

    static propTypes = {
        ...Container.propTypes,
        info: PropTypes.array,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        renderItem: PropTypes.func,
    };

    static AnnotationContent = Content;
    
    static __SemiComponentName__ = "Sidebar.Annotation";

    static defaultProps = {};

    render() {
        const containerProps = pick(this.props, ['title', 'style', 'visible', 'motion', 'minWidth', 'maxWidth', 'onCancel', 'afterVisibleChange', 'resizable', 'defaultSize', 'children', 'className']);
        const contentProps = pick(this.props, ['activeKey', 'info', 'onChange', 'onClick', 'renderItem']);
        return <LocaleConsumer componentName="Sidebar" >
            {(locale: Locale['Sidebar']) => (
                <Container
                    {...containerProps}
                    className={cls(prefixCls, {
                        [containerProps.className]: containerProps.className
                    })}
                    title={containerProps.title ?? locale.annotationTitle}
                >
                    <Content 
                        {...contentProps}
                    />
                </Container>
            )}
        </LocaleConsumer>;
    }

}

export default Annotation;
