import JsonViewerFoundation, { JsonViewerOptions, JsonViewer, JsonViewerAdapter } from "@douyinfe/semi-foundation/jsonViewer/foundation";
import { PureComponent } from "react";
import React from "react";
import '@douyinfe/semi-foundation/jsonViewer/jsonViewer.scss';
import classNames from "classnames";
import { cssClasses } from "@douyinfe/semi-foundation/jsonViewer/constants";
import ButtonGroup from "../button/buttonGroup";
import Button from "../iconButton";
import Input from "../input";
import { IconCaseSensitive, IconChevronLeft, IconChevronRight, IconClose, IconRegExp, IconSearch, IconWholeWord } from "@douyinfe/semi-icons";
import BaseComponent, { BaseProps } from "../_base/baseComponent";
const prefixCls = cssClasses.PREFIX;

export interface JsonViewerProps extends BaseProps {
    value: string;
    width: number;
    height: number;
    onChange?: (value: string) => void;
    onValueHover?: (value: string, el: HTMLElement) => HTMLElement;
    options?: JsonViewerOptions
}

export interface JsonViewerState {
    searchOptions: SearchOptions;
    showSearchBar: boolean
}

interface SearchOptions {
    caseSensitive: boolean;
    wholeWord: boolean;
    regex: boolean
}

class JsonViewerCpn extends BaseComponent<JsonViewerProps, JsonViewerState> {

    static defaultProps: Partial<JsonViewerProps> = {
        width: 400,
        height: 400,
        value: ''
    };

    private editorRef: React.RefObject<HTMLDivElement>;
    private searchInputRef: React.RefObject<HTMLInputElement>;
    private replaceInputRef: React.RefObject<HTMLInputElement>;

    foundation: JsonViewerFoundation;

    constructor(props: JsonViewerProps) {
        super(props);
        this.editorRef = React.createRef();
        this.searchInputRef = React.createRef();
        this.replaceInputRef = React.createRef();
        this.foundation = new JsonViewerFoundation(this.adapter);
        this.state = {
            searchOptions: {
                caseSensitive: false,
                wholeWord: false,
                regex: false,
            },
            showSearchBar: true
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    // componentDidUpdate(prevProps: JsonViewerProps) {
    //     if (prevProps.value !== this.props.value || prevProps.options !== this.props.options) {
    //         this.initJsonViewer();
    //     }
    // }

    get adapter(): JsonViewerAdapter<JsonViewerProps, JsonViewerState> {
        return {
            ...super.adapter,
            getJsonViewerRef: () => this.editorRef.current,
            onValueChange: (value) => {
                this.props.onChange?.(value);
            },
            onValueHover: (value, el) => {
                const res = this.props.onValueHover?.(value, el);
                return res;
            }
        };
    }


    getStyle() {
        const { width, height } = this.props;
        return {
            width,
            height
        };
    }

    searchHandler = () => {
        const value = this.searchInputRef.current?.value;
        this.foundation.search(value);
    }

    changeSearchOptions = (key: string) => {
        this.setState({
            searchOptions: {
                ...this.state.searchOptions,
                [key]: !this.state.searchOptions[key]
            }
        });
        this.searchHandler();
    }

    renderSearchOptions() {
        const searchOptionItems = [
            {
                key: 'caseSensitive',
                icon: IconCaseSensitive
            },
            {
                key: 'regex',
                icon: IconRegExp
            },
            {
                key: 'wholeWord',
                icon: IconWholeWord
            }
        ];

        return (
            <ul className={`${prefixCls}-search-options`}>
                {searchOptionItems.map(({ key, icon: Icon }) => (
                    <li
                        key={key}
                        className={classNames(`${prefixCls}-search-options-item`, {
                            [`${prefixCls}-search-options-item-active`]: this.state.searchOptions[key]
                        })}
                    >
                        <Icon onClick={() => this.changeSearchOptions(key)} />
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return (
            <>
                <div style={this.getStyle()} ref={this.editorRef} className={classNames(prefixCls, `${prefixCls}-background`)}></div>
                <div>
                    <Button onClick={() => this.setState({ showSearchBar: !this.state.showSearchBar })} icon={<IconSearch />} />
                </div>
                {this.state.showSearchBar && <div className={`${prefixCls}-search-bar-container`}>
                    <div className={`${prefixCls}-search-bar`}>
                        <Input
                            placeholder="查找"
                            style={{ width: 200 }}
                            onChange={(_value, e) => {
                                e.preventDefault();
                                this.searchHandler();
                                this.searchInputRef.current?.focus();
                            }}
                            ref={this.searchInputRef}
                        />
                        {this.renderSearchOptions()}
                        <div >
                            <ButtonGroup>
                                <Button icon={<IconChevronLeft />} onClick={(e) => {
                                    e.preventDefault();
                                    this.foundation.prevSearch();
                                }} />
                                <Button icon={<IconChevronRight />} onClick={(e) => {
                                    e.preventDefault();
                                    this.foundation.nextSearch();
                                }} />
                            </ButtonGroup>
                        </div>
                        <Button icon={<IconClose />} size="small"
                            theme={'borderless'}
                            type={'tertiary'}
                            onClick={() => this.setState({ showSearchBar: false })} />
                    </div>

                    <div className={`${prefixCls}-replace-bar`}>
                        <Input
                            placeholder="替换"
                            style={{ width: 260 }}
                            onChange={(value, e) => {
                                e.preventDefault();
                            }}
                            ref={this.replaceInputRef}
                        />
                        <Button onClick={() => {
                            const value = this.replaceInputRef.current?.value;
                            this.foundation.replace(value);
                        }}>替换</Button>
                        <Button onClick={() => {
                            const value = this.replaceInputRef.current?.value;
                            this.foundation.replaceAll(value);
                        }}>全部替换</Button>
                    </div>
                </div>}
            </>
        );
    }
}


export default JsonViewerCpn;