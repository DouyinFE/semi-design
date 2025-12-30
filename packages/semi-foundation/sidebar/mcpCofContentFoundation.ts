import { throttle } from 'lodash';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { strings } from './constants';
import { getFilterResult } from './utils';

export interface MCPOption {
    icon?: any;
    label?: string;
    value?: string;
    desc?: any;
    active?: boolean;
    disabled?: boolean;
    configure?: boolean
}

export interface MCPConfigureContentProps {
    className?: string;
    options?: MCPOption[];
    customOptions?: MCPOption[];
    filter?: (inputValue: string, option: MCPOption) => boolean;
    placeholder?: string;
    style?: any;
    onStatusChange?: (options: MCPOption[], custom: boolean) => void;
    onSearch?: (inputValue: string, custom: boolean) => void;
    onAddClick?: (e: any) => void;
    onConfigureClick?: (e: any, option: MCPOption) => void;
    onEditClick?: (e: any, option: MCPOption) => void;
    renderItem?: (props: { 
        option: MCPOption; 
        custom: boolean
    }) => any

}

export type MCPConfigureMode = 'inner' | 'custom';

export interface MCPConfigureContentState {
    mode: MCPConfigureMode;
    inputValue: string;
    showOptions: MCPOption[];
    cachedOptions: MCPOption[];
    cachedCustomOptions: MCPOption[]
}

export interface MCPConfigureContentAdapter extends DefaultAdapter<MCPConfigureContentProps, MCPConfigureContentState> {
    notifyConfigureClick: (e: any, option: MCPOption) => void;
    notifyEditClick: (e: any, option: MCPOption) => void;
    notifyStatusChange?: (options: MCPOption[], custom: boolean) => void;
    notifyAddClick?: (e: any) => void
    
}

export default class MCPConfigureContentFoundation extends BaseFoundation<MCPConfigureContentAdapter> {
    constructor(adapter: MCPConfigureContentAdapter) {
        super({ ...adapter });
    }

    handleSearch = (value: string) => {
        this.setState({ inputValue: value });
        this.updateShowOptions(value);
    }

    updateShowOptions = throttle((value: string, mode?: MCPConfigureMode) => {
        let realMode = mode ?? this.getState('mode');
        const { options = [], customOptions = [], filter } = this.getProps();
        let showOptions = [];
        if (realMode === strings.MCP_MODE.INNER) {
            showOptions = value ? getFilterResult(value, options, filter) : options;
        } else {
            showOptions = value ? getFilterResult(value, customOptions, filter) : customOptions;
        }
        this.setState({ showOptions });
    }, 300)

    handleModeChange = (e: any) => {
        const newMode = e.target.value;
        this.setState({ mode: newMode });
        this.updateShowOptions(this.getState('inputValue'), newMode);

    }

    onConfigureButtonClick = (e: React.MouseEvent<HTMLButtonElement>, option: MCPOption) => {
        this._adapter.notifyConfigureClick(e, option);
    }

    onEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>, option: MCPOption) => {
        this._adapter.notifyEditClick(e, option);
    }

    handleStatusChange = (item: MCPOption, checked: boolean) => {
        const { options = [], customOptions = [] } = this.getProps();
        let newOptions = [];
        const mode = this.getState('mode');
        if (mode === strings.MCP_MODE.INNER) {
            newOptions = options.map(option => option.value === item.value ? { ...option, active: checked } : option);
        } else {
            newOptions = customOptions.map(option => option.value === item.value ? { ...option, active: checked } : option);
        }
        this._adapter.notifyStatusChange(newOptions, mode === strings.MCP_MODE.CUSTOM);
    }

    handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        this._adapter.notifyAddClick(e);
    }
   
}