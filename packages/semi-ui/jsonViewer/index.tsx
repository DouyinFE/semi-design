import React from 'react';
import classNames from 'classnames';
import JsonViewerFoundation, {
    JsonViewerOptions,
    JsonViewerAdapter,
} from '@douyinfe/semi-foundation/jsonViewer/foundation';
import '@douyinfe/semi-foundation/jsonViewer/jsonViewer.scss';
import { cssClasses } from '@douyinfe/semi-foundation/jsonViewer/constants';
import ButtonGroup from '../button/buttonGroup';
import Button from '../button';
import Input from '../input';
import DragMove from '../dragMove';
import {
    IconCaseSensitive,
    IconChevronLeft,
    IconChevronRight,
    IconClose,
    IconRegExp,
    IconSearch,
    IconWholeWord,
} from '@douyinfe/semi-icons';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import {isEqual} from "lodash";
const prefixCls = cssClasses.PREFIX;

export type { JsonViewerOptions };
export interface JsonViewerProps extends BaseProps {
    value: string;
    width: number;
    height: number;
    showSearch?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onChange?: (value: string) => void;
    renderTooltip?: (value: string, el: HTMLElement) => HTMLElement;
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

class JsonViewerCom extends BaseComponent<JsonViewerProps, JsonViewerState> {
    static defaultProps: Partial<JsonViewerProps> = {
        width: 400,
        height: 400,
        value: '',
        options: {
            readOnly: false,
            autoWrap: true
        }
    };

    private editorRef: React.RefObject<HTMLDivElement>;
    private searchInputRef: React.RefObject<HTMLInputElement>;
    private replaceInputRef: React.RefObject<HTMLInputElement>;
    private isComposing: boolean = false;

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
            showSearchBar: false,
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(prevProps: JsonViewerProps): void {
        if (!isEqual(prevProps.options, this.props.options) || this.props.value !== prevProps.value) {
            this.foundation.jsonViewer.dispose();
            this.foundation.init();
        }
    }

    get adapter(): JsonViewerAdapter<JsonViewerProps, JsonViewerState> {
        return {
            ...super.adapter,
            getEditorRef: () => this.editorRef.current,
            getSearchRef: () => this.searchInputRef.current,
            notifyChange: value => {
                this.props.onChange?.(value);
            },
            notifyHover: (value, el) => {
                const res = this.props.renderTooltip?.(value, el);
                return res;
            },
            setSearchOptions: (key: string) => {
                this.setState(
                    {
                        searchOptions: {
                            ...this.state.searchOptions,
                            [key]: !this.state.searchOptions[key],
                        },
                    },
                    () => {
                        this.searchHandler();
                    }
                );
            },
            showSearchBar: () => {
                this.setState({ showSearchBar: !this.state.showSearchBar });
            },
        };
    }

    getValue() {
        return this.foundation.jsonViewer.getModel().getValue();
    }

    format() {
        this.foundation.jsonViewer.format();
    }

    getStyle() {
        const { width, height } = this.props;
        return {
            width,
            height,
        };
    }

    searchHandler = () => {
        const value = this.searchInputRef.current?.value;
        this.foundation.search(value);
    };

    changeSearchOptions = (key: string) => {
        this.foundation.setSearchOptions(key);
    };

    renderSearchBox() {
        return (
            <div className={`${prefixCls}-search-bar-container`}>
                {this.renderSearchBar()}
                {this.renderReplaceBar()}
            </div>
        );
    }

    renderSearchOptions() {
        const searchOptionItems = [
            {
                key: 'caseSensitive',
                icon: IconCaseSensitive,
            },
            {
                key: 'regex',
                icon: IconRegExp,
            },
            {
                key: 'wholeWord',
                icon: IconWholeWord,
            },
        ];

        return (
            <ul className={`${prefixCls}-search-options`}>
                {searchOptionItems.map(({ key, icon: Icon }) => (
                    <li
                        key={key}
                        className={classNames(`${prefixCls}-search-options-item`, {
                            [`${prefixCls}-search-options-item-active`]: this.state.searchOptions[key],
                        })}
                    >
                        <Icon onClick={() => this.changeSearchOptions(key)} />
                    </li>
                ))}
            </ul>
        );
    }

    renderSearchBar() {
        return (
            <div className={`${prefixCls}-search-bar`}>
                <Input
                    placeholder="查找"
                    className={`${prefixCls}-search-bar-input`}
                    onChange={(_value, e) => {
                        e.preventDefault();
                        if (!this.isComposing) {
                            this.searchHandler();
                        }
                        this.searchInputRef.current?.focus();
                    }}
                    onCompositionStart={() => {
                        this.isComposing = true;
                    }}
                    onCompositionEnd={() => {
                        this.isComposing = false;
                        this.searchHandler();
                        this.searchInputRef.current?.focus();
                    }}
                    ref={this.searchInputRef}
                />
                {this.renderSearchOptions()}
                <ButtonGroup>
                    <Button
                        icon={<IconChevronLeft />}
                        onClick={e => {
                            e.preventDefault();
                            this.foundation.prevSearch();
                        }}
                    />
                    <Button
                        icon={<IconChevronRight />}
                        onClick={e => {
                            e.preventDefault();
                            this.foundation.nextSearch();
                        }}
                    />
                </ButtonGroup>
                <Button
                    icon={<IconClose />}
                    size="small"
                    theme={'borderless'}
                    type={'tertiary'}
                    onClick={() => this.foundation.showSearchBar()}
                />
            </div>
        );
    }

    renderReplaceBar() {
        const { readOnly } = this.props.options;
        return (
            <div className={`${prefixCls}-replace-bar`}>
                <Input
                    placeholder="替换"
                    className={`${prefixCls}-replace-bar-input`}
                    onChange={(value, e) => {
                        e.preventDefault();
                    }}
                    ref={this.replaceInputRef}
                />
                <Button
                    disabled={readOnly}
                    onClick={() => {
                        const value = this.replaceInputRef.current?.value;
                        this.foundation.replace(value);
                    }}
                >
                    替换
                </Button>
                <Button
                    disabled={readOnly}
                    onClick={() => {
                        const value = this.replaceInputRef.current?.value;
                        this.foundation.replaceAll(value);
                    }}
                >
                    全部替换
                </Button>
            </div>
        );
    }

    render() {
        let isDragging = false;
        const { width, className, style, showSearch = true, ...rest } = this.props;
        return (
            <>
                <div style={{ ...this.getStyle(), position: 'relative', ...style }} className={className} {...this.getDataAttr(rest)}>
                    <div
                        style={{ ...this.getStyle(), padding: '12px 0' }}
                        ref={this.editorRef}
                        className={classNames(prefixCls, `${prefixCls}-background`)}
                    ></div>
                    {showSearch && (
                        <DragMove
                            onMouseDown={() => {
                                isDragging = false;
                            }}
                            onMouseMove={() => {
                                isDragging = true;
                            }}
                        >
                            <div style={{ position: 'absolute', top: 20, left: width - 52 }}>
                                {!this.state.showSearchBar ? (
                                    <Button
                                        className={`${prefixCls}-search-bar-trigger`}
                                        onClick={e => {
                                            e.preventDefault();
                                            if (isDragging) {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                return;
                                            }
                                            this.foundation.showSearchBar();
                                        }}
                                        icon={<IconSearch />}
                                    />
                                ) : (
                                    this.renderSearchBox()
                                )}
                            </div>
                        </DragMove>
                    )}
                </div>
            </>
        );
    }
}

export default JsonViewerCom;
