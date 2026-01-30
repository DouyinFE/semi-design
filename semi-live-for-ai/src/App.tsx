import React, { useState, useCallback } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';

// Semi UI 组件 - 使用稳定的导入方式
import {
    // Layout
    Row, Col, Layout,
    // Navigation
    Nav, Breadcrumb, Anchor, BackTop, Pagination, Steps, Step, Tabs, TabPane,
    // Input
    Input, InputGroup, TextArea, InputNumber, AutoComplete, Cascader, Checkbox, CheckboxGroup,
    DatePicker, Radio, RadioGroup, Rating, Select, Slider, Switch, TimePicker, Transfer, TreeSelect,
    Upload, TagInput, ColorPicker, PinCode,
    // Display
    Avatar, AvatarGroup, Badge, Calendar, Card, CardGroup, Carousel, Collapse, Collapsible,
    Descriptions, Divider, Empty, Image, List, Popover, Table, Tag, TagGroup,
    Timeline, Tooltip, Tree, Typography, Skeleton, OverflowList, ScrollList, ScrollItem,
    // Feedback
    Banner, Modal, Notification, Popconfirm, Progress, SideSheet, Spin, Toast,
    // Form
    Form, useFormApi, useFormState, useFieldApi, useFieldState, withFormState, withFormApi, withField, ArrayField,
    // Button
    Button, ButtonGroup, IconButton, SplitButtonGroup,
    // Other
    ConfigProvider, LocaleProvider, Space, Dropdown, DropdownMenu, DropdownItem, DropdownDivider,
    Highlight,
} from '@douyinfe/semi-ui';

// Semi Icons
import {
    IconPlus,
    IconMinus,
    IconRefresh,
    IconSearch,
    IconSetting,
    IconEdit,
    IconDelete,
    IconCode,
    IconEyeOpened,
    IconGridView,
    IconUser,
    IconHome,
    IconStar,
    IconHeart,
    IconLike,
    IconComment,
    IconShare,
    IconDownload,
    IconUpload,
    IconCopy,
    IconClose,
    IconTick,
    IconArrowLeft,
    IconArrowRight,
    IconArrowUp,
    IconArrowDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconChevronDown,
    IconFilter,
    IconSort,
    IconMore,
    IconMenu,
    IconBell,
    IconMail,
    IconCalendar,
    IconClock,
    IconImage,
    IconFile,
    IconFolder,
    IconLink,
    IconGlobe,
    IconLock,
    IconUnlock,
    IconInfoCircle,
    IconAlertCircle,
    IconAlertTriangle,
    IconHelpCircle,
    IconCheckCircleStroked,
    IconPlay,
    IconPause,
    IconStop,
    IconVolume1,
    IconVolume2,
    IconMute,
    IconSun,
    IconMoon,
    IconGithubLogo,
    IconSemiLogo,
} from '@douyinfe/semi-icons';

import './App.css';

// 默认代码示例
const defaultCode = `() => {
    const [count, setCount] = useState(0);
    
    return (
        <Space vertical align="start">
            <Typography.Title heading={3}>
                Semi Design Live Editor
            </Typography.Title>
            <Typography.Text>
                点击次数: {count}
            </Typography.Text>
            <Space>
                <Button 
                    type="primary" 
                    icon={<IconPlus />}
                    onClick={() => setCount(c => c + 1)}
                >
                    增加
                </Button>
                <Button 
                    type="secondary"
                    icon={<IconMinus />}
                    onClick={() => setCount(c => c - 1)}
                >
                    减少
                </Button>
                <Button 
                    type="tertiary"
                    icon={<IconRefresh />}
                    onClick={() => setCount(0)}
                >
                    重置
                </Button>
            </Space>
            <Divider margin="12px" />
            <Space>
                <Tag color="blue">Semi Design</Tag>
                <Tag color="green">React Live</Tag>
                <Tag color="orange">实时预览</Tag>
            </Space>
        </Space>
    );
}`;

// noInline 模式的默认代码
const noInlineDefaultCode = `const App = () => {
    const [visible, setVisible] = useState(false);
    
    return (
        <Space vertical align="start">
            <Typography.Title heading={4}>
                NoInline 模式示例
            </Typography.Title>
            <Button 
                type="primary"
                onClick={() => setVisible(true)}
            >
                打开 Modal
            </Button>
            <Modal
                title="欢迎使用 Semi Design"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <Typography.Text>
                    这是一个在 noInline 模式下的 Modal 示例。
                    noInline 模式需要手动调用 render() 函数。
                </Typography.Text>
            </Modal>
        </Space>
    );
};

render(<App />);`;

// 创建 scope 对象，包含所有 Semi 组件和图标
const scope = {
    // React hooks
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    useRef: React.useRef,
    useContext: React.useContext,
    useReducer: React.useReducer,
    
    // Layout
    Layout, Row, Col,
    
    // Navigation
    Nav, Breadcrumb, Anchor, BackTop, Pagination, Steps, Step, Tabs, TabPane,
    
    // Input
    Input, InputGroup, TextArea, InputNumber, AutoComplete, Cascader, Checkbox, CheckboxGroup,
    DatePicker, Radio, RadioGroup, Rating, Select, Slider, Switch, TimePicker, Transfer, TreeSelect,
    Upload, TagInput, ColorPicker, PinCode,
    
    // Display
    Avatar, AvatarGroup, Badge, Calendar, Card, CardGroup, Carousel, Collapse, Collapsible,
    Descriptions, Divider, Empty, Image, List, Popover, Table, Tag, TagGroup,
    Timeline, Tooltip, Tree, Typography, Skeleton, OverflowList, ScrollList, ScrollItem,
    
    // Feedback
    Banner, Modal, Notification, Popconfirm, Progress, SideSheet, Spin, Toast,
    
    // Form
    Form, useFormApi, useFormState, useFieldApi, useFieldState, withFormState, withFormApi, withField, ArrayField,
    
    // Button
    Button, ButtonGroup, IconButton, SplitButtonGroup,
    
    // Other
    ConfigProvider, LocaleProvider, Space, Dropdown, DropdownMenu, DropdownItem, DropdownDivider, Highlight,
    
    // Icons
    IconPlus, IconMinus, IconRefresh, IconSearch, IconSetting, IconEdit, IconDelete,
    IconCode, IconEyeOpened, IconGridView, IconUser, IconHome, IconStar, IconHeart,
    IconLike, IconComment, IconShare, IconDownload, IconUpload, IconCopy, IconClose, IconTick,
    IconArrowLeft, IconArrowRight, IconArrowUp, IconArrowDown,
    IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown,
    IconFilter, IconSort, IconMore, IconMenu, IconBell, IconMail, IconCalendar, IconClock,
    IconImage, IconFile, IconFolder, IconLink, IconGlobe, IconLock, IconUnlock,
    IconInfoCircle, IconAlertCircle, IconAlertTriangle, IconHelpCircle, IconCheckCircleStroked,
    IconPlay, IconPause, IconStop, IconVolume1, IconVolume2, IconMute,
    IconSun, IconMoon, IconGithubLogo, IconSemiLogo,
};

type EditorMode = 'inline' | 'noInline';
type LayoutMode = 'horizontal' | 'vertical';

function App() {
    const [code, setCode] = useState(defaultCode);
    const [editorMode, setEditorMode] = useState<EditorMode>('inline');
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
    const [showLineNumbers, setShowLineNumbers] = useState(true);

    // 切换模式时更新代码
    const handleModeChange = useCallback((mode: EditorMode) => {
        setEditorMode(mode);
        if (mode === 'noInline') {
            setCode(noInlineDefaultCode);
        } else {
            setCode(defaultCode);
        }
    }, []);

    // 重置代码
    const handleReset = useCallback(() => {
        if (editorMode === 'noInline') {
            setCode(noInlineDefaultCode);
        } else {
            setCode(defaultCode);
        }
    }, [editorMode]);

    const isHorizontal = layoutMode === 'horizontal';

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <IconCode style={{ fontSize: 24, marginRight: 8 }} />
                    <Typography.Title heading={4} style={{ margin: 0 }}>
                        Semi Design Live Editor
                    </Typography.Title>
                </div>
                <div className="header-right">
                    <Space>
                        {/* 编辑器模式 */}
                        <Select
                            value={editorMode}
                            onChange={(value) => handleModeChange(value as EditorMode)}
                            style={{ width: 140 }}
                            prefix={<IconSetting />}
                        >
                            <Select.Option value="inline">Inline 模式</Select.Option>
                            <Select.Option value="noInline">NoInline 模式</Select.Option>
                        </Select>
                        
                        {/* 布局模式 */}
                        <Select
                            value={layoutMode}
                            onChange={(value) => setLayoutMode(value as LayoutMode)}
                            style={{ width: 140 }}
                            prefix={<IconGridView />}
                        >
                            <Select.Option value="horizontal">水平布局</Select.Option>
                            <Select.Option value="vertical">垂直布局</Select.Option>
                        </Select>

                        {/* 行号显示 */}
                        <Checkbox
                            checked={showLineNumbers}
                            onChange={(e) => setShowLineNumbers(e.target.checked)}
                        >
                            显示行号
                        </Checkbox>

                        {/* 重置按钮 */}
                        <Button
                            icon={<IconRefresh />}
                            onClick={handleReset}
                        >
                            重置代码
                        </Button>
                    </Space>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
                <LiveProvider
                    code={code}
                    scope={scope}
                    noInline={editorMode === 'noInline'}
                >
                    <div className={`live-container ${isHorizontal ? 'horizontal' : 'vertical'}`}>
                        {/* Editor Panel */}
                        <div className="editor-panel">
                            <div className="panel-header">
                                <IconEdit style={{ marginRight: 8 }} />
                                <span>代码编辑器</span>
                                <Tag color="blue" style={{ marginLeft: 8 }}>
                                    {editorMode === 'noInline' ? '需要调用 render()' : '自动渲染'}
                                </Tag>
                            </div>
                            <div className={`editor-wrapper ${showLineNumbers ? 'show-line-numbers' : ''}`}>
                                <LiveEditor 
                                    onChange={setCode}
                                    className="live-editor"
                                />
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="preview-panel">
                            <div className="panel-header">
                                <IconEyeOpened style={{ marginRight: 8 }} />
                                <span>预览区域</span>
                            </div>
                            <div className="preview-wrapper">
                                <LiveError className="live-error" />
                                <LivePreview className="live-preview" />
                            </div>
                        </div>
                    </div>
                </LiveProvider>
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <Typography.Text type="tertiary">
                    提示：所有 Semi Design 组件和常用图标都已注入到编辑器中，可以直接使用。
                </Typography.Text>
            </footer>
        </div>
    );
}

export default App;
