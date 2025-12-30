import React, { CSSProperties, MouseEventHandler, ReactNode, useState } from 'react';
import cls from 'classnames';
import BaseComponent from '../../_base/baseComponent';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/sidebar/constants';
import { RadioGroup, Radio, Input, Tooltip, Button, Empty } from '../../index';
import { IconSearch, IconPlus, IconSetting, IconMinus, IconEdit } from '@douyinfe/semi-icons';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import MCPConfigureContentFoundation, { MCPOption, MCPConfigureContentProps, MCPConfigureMode, MCPConfigureContentState, MCPConfigureContentAdapter } from '@douyinfe/semi-foundation/sidebar/mcpCofContentFoundation';
import LocaleConsumer from '../../locale/localeConsumer';
import { Locale } from '../../locale/interface';
import { getFilterResult } from '@douyinfe/semi-foundation/sidebar/utils';

const prefixCls = cssClasses.MCP_CONFIGURE_CONTENT;

export interface MCPReactOption extends MCPOption {
    icon?: ReactNode;
    desc?: ReactNode
}

export interface MCPConfigureContentReactProps extends MCPConfigureContentProps {
    options?: MCPReactOption[];
    customOptions?: MCPReactOption[];
    filter?: (inputValue: string, option: MCPReactOption) => boolean;
    style?: CSSProperties;
    onStatusChange?: (options: MCPReactOption[], custom: boolean) => void;
    onAddClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onConfigureClick?: (e: React.MouseEvent<HTMLButtonElement>, option: MCPReactOption) => void;
    onEditClick?: (e: React.MouseEvent<HTMLButtonElement>, option: MCPReactOption) => void;
    renderItem?: (props: { 
        option: MCPReactOption;
        custom: boolean
    }) => ReactNode
}



interface MCPConfigureContentReactState extends MCPConfigureContentState{
    showOptions: MCPReactOption[];
    cachedOptions: MCPReactOption[];
    cachedCustomOptions: MCPReactOption[]
}

class MCPConfigureContent extends BaseComponent<MCPConfigureContentReactProps, MCPConfigureContentReactState> {

    static propTypes = {
        className: PropTypes.string,
        options: PropTypes.array,
        customOptions: PropTypes.array,
        filter: PropTypes.func,
        placeholder: PropTypes.string,
        style: PropTypes.object,
        onStatusChange: PropTypes.func,
        onSearch: PropTypes.func,
        onAddClick: PropTypes.func,
        onConfigureClick: PropTypes.func,
        onEditClick: PropTypes.func,
        renderItem: PropTypes.func,
    };
    
    static __SemiComponentName__ = "MCPConfigureContent";

    static defaultProps = {};

    foundation: MCPConfigureContentFoundation;

    constructor(props: MCPConfigureContentReactProps) {
        super(props);
        this.state = {
            mode: strings.MCP_MODE.INNER,
            inputValue: '',
            showOptions: props.options ?? [],
            cachedOptions: props.options ?? [],
            cachedCustomOptions: props.customOptions ?? [],
        };
        this.foundation = new MCPConfigureContentFoundation(this.adapter);
    }

    get adapter(): MCPConfigureContentAdapter {
        return {
            ...super.adapter,
            notifyConfigureClick: (e: React.MouseEvent<HTMLButtonElement>, option: MCPOption) => {
                this.props.onConfigureClick?.(e, option);
            },
            notifyEditClick: (e: React.MouseEvent<HTMLButtonElement>, option: MCPOption) => {
                this.props.onEditClick?.(e, option);
            },
            notifyStatusChange: (options: MCPOption[], custom: boolean) => {
                this.props.onStatusChange?.(options, custom);
            },
            notifyAddClick: (e: any) => {
                this.props.onAddClick?.(e);
            }
        };
    }

    static getDerivedStateFromProps(nextProps: MCPConfigureContentReactProps, prevState: MCPConfigureContentReactState) {
        const newState = {} as Partial<MCPConfigureContentReactState>;
        const { options = [], customOptions = [], filter } = nextProps;
        const { cachedOptions = [], cachedCustomOptions = [] } = prevState;

        if (options !== cachedOptions) {
            newState.cachedOptions = options;
            if (prevState.mode === strings.MCP_MODE.INNER) {
                if (!prevState.inputValue) {
                    newState.showOptions = options;
                } else {
                    newState.showOptions = getFilterResult(prevState.inputValue, options, filter);
                }
            }
        }
        if (customOptions !== cachedCustomOptions) {
            newState.cachedCustomOptions = customOptions;
            if (prevState.mode === strings.MCP_MODE.CUSTOM) {
                if (!prevState.inputValue) {
                    newState.showOptions = customOptions;
                } else {
                    newState.showOptions = getFilterResult(prevState.inputValue, customOptions, filter);
                }
            }
        }
        return newState;
    }

    renderContent = () => {
        const { showOptions, mode } = this.state;
        const { renderItem } = this.props;
        return <div className={`${prefixCls}-item-container`}>
            {showOptions.map(option => {
                if (renderItem) {
                    return renderItem({
                        custom: mode === strings.MCP_MODE.CUSTOM,
                        option: option,
                    });
                }
                return (<div key={option.value} className={`${prefixCls}-item`}>
                    {typeof option.icon === 'string' ? 
                        <img 
                            src={option.icon} 
                            alt={option.label}
                            className={`${prefixCls}-item-sign`}
                        /> :
                        <div className={`${prefixCls}-item-sign`}>
                            {option.icon}
                        </div>
                    }
                    <div className={`${prefixCls}-item-content`}>
                        <div className={`${prefixCls}-item-content-label`}>
                            {option.label}
                        </div>
                        <div className={`${prefixCls}-item-content-desc`}>
                            {option.desc}
                        </div>
                    </div>
                    {option.configure && <Button
                        icon={<IconSetting />}
                        className={`${prefixCls}-item-button ${prefixCls}-item-button-configure`}
                        onClick={(e) => this.foundation.onConfigureButtonClick(e, option)}
                    />}
                    {
                        mode === strings.MCP_MODE.CUSTOM && <Button
                            icon={<IconEdit />}
                            className={`${prefixCls}-item-button ${prefixCls}-item-button-configure`}
                            onClick={(e) => this.foundation.onEditButtonClick(e, option)}
                        />
                    }
                    {this.renderStatusButton(option)}
                </div>);
            })}
        </div>;
    }

    renderStatusButton = (option: MCPOption) => {
        const buttonNode = <Button
            icon={option.active ? <IconMinus /> : <IconPlus />}
            theme={option.active ? 'light' : 'solid'}
            type={'primary'}
            className={`${prefixCls}-item-button`}
            disabled={option.disabled}
            checked={option.active}
            onClick={() => this.foundation.handleStatusChange(option, !option.active)} 
        />;
        return option.disabled ? <LocaleConsumer componentName="Sidebar" >
            {(locale: Locale['Sidebar']) => (<Tooltip title={locale.defaultMcpInfo}>{buttonNode}</Tooltip>)}
        </LocaleConsumer> : buttonNode;
    }

    renderSearch = () => {
        const { placeholder, customOptions } = this.props;
        if (this.state.mode === strings.MCP_MODE.INNER) {
            return <LocaleConsumer componentName="Sidebar" >
                {(locale: Locale['Sidebar']) => (<Input 
                    prefix={<IconSearch />}
                    value={this.state.inputValue}
                    placeholder={placeholder ?? locale.searchPlaceholder}
                    onChange={this.foundation.handleSearch}
                    className={`${prefixCls}-search`}
                />)}</LocaleConsumer>;
        } else {
            if (customOptions === undefined || customOptions === null || (Array.isArray(customOptions) && customOptions.length === 0)) {
                return <LocaleConsumer componentName="Sidebar" >
                    {(locale: Locale['Sidebar']) => (<Empty
                        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                        darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                        description={locale.emptyCustomMcpInfo}
                        className={`${prefixCls}-custom-empty`}
                    >
                        <Button
                            theme='solid'
                            type='primary'
                            icon={<IconPlus />}
                            onClick={this.foundation.handleAddClick}
                        >
                            {locale.newMcpAdd}
                        </Button>
                    </Empty>)}
                </LocaleConsumer>;
            }
            return <div className={`${prefixCls}-search ${prefixCls}-search-container`}>
                <LocaleConsumer componentName="Sidebar" >
                    {(locale: Locale['Sidebar']) => (<>
                        <Input 
                            prefix={<IconSearch />}
                            value={this.state.inputValue}
                            placeholder={placeholder ?? locale.searchPlaceholder}
                            onChange={this.foundation.handleSearch}
                        />
                        <Button
                            theme='solid'
                            type='primary'
                            icon={<IconPlus />}
                            onClick={this.foundation.handleAddClick}
                        >
                            {locale.newMcpAdd}
                        </Button>
                    </>)}
                </LocaleConsumer>
                
            </div>;
        }
    }

    render() {
        const { options = [], customOptions = [], className, style } = this.props;
        const activatedCount = options.filter(option => option.active).length + customOptions.filter(option => option.active).length;
        return <div className={cls(prefixCls, { [className]: className })} style={style}>
            {/* header */}
            <LocaleConsumer componentName="Sidebar" >
                {(locale: Locale['Sidebar']) => (
                    <div className={`${prefixCls}-header`}>
                        <RadioGroup 
                            type='button' 
                            value={this.state.mode}
                            onChange={this.foundation.handleModeChange}
                        >
                            <Radio value={strings.MCP_MODE.INNER}>MCP Servers</Radio>
                            <Radio value={strings.MCP_MODE.CUSTOM}>{locale.newMcpAdd}</Radio>
                        </RadioGroup>
                        <span className={`${prefixCls}-header-count`}>{locale.activeMCPNumber} {activatedCount}/{options.length + customOptions.length}</span>
                    </div>)}
            </LocaleConsumer>
            {/* search */}
            {this.renderSearch()}
            {/* content */}
            {this.renderContent()}
        </div>;
    }

}

export default MCPConfigureContent;
