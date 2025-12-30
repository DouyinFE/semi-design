import React, { CSSProperties, ReactNode, useState } from 'react';
import cls from 'classnames';
import BaseComponent from '../../_base/baseComponent';
import PropTypes from 'prop-types';
import Container from '../container';
import MCPConfigureContent from './content';
import type { MCPConfigureContentReactProps } from './content';
import { pick } from 'lodash';
import { ContainerReactProps } from '../interface';
import LocaleConsumer from '../../locale/localeConsumer';
import { Locale } from '../../locale/interface';

interface MCPConfigureProps extends ContainerReactProps, MCPConfigureContentReactProps {}

interface MCPConfigureState {}

class MCPConfigure extends BaseComponent<MCPConfigureProps, MCPConfigureState> {

    static propTypes = {
        ...Container.propTypes,
        options: PropTypes.array,
        customOptions: PropTypes.array,
        onStatusChange: PropTypes.func,
        onSearch: PropTypes.func,
        onAddClick: PropTypes.func,
        renderItem: PropTypes.func,
    };
    
    static __SemiComponentName__ = "Sidebar.MCPConfigure";

    render() {
        const containerProps = pick(this.props, ['title', 'style', 'visible', 'motion', 'minWidth', 'maxWidth', 'onCancel', 'afterVisibleChange', 'resizable', 'defaultSize', 'children', 'className']);
        const mcpConfigureContentProps = pick(this.props, ['options', 'customOptions', 'filter', 'placeholder', 'onStatusChange', 'onSearch', 'onAddClick', 'onConfigureClick', 'onEditClick', 'renderItem']);
        return <LocaleConsumer componentName="Sidebar" >
            {(locale: Locale['Sidebar']) => (
                <Container
                    {...containerProps}
                    title={containerProps.title ?? locale.mcpConfigure}
                >
                    <MCPConfigureContent 
                        {...mcpConfigureContentProps}
                    />
                </Container>
            )}
        </LocaleConsumer>;
    }
}

export default MCPConfigure;
