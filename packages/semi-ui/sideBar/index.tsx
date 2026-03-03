import React, { ReactElement } from 'react';
import { SideBarProps } from './interface';
import { cssClasses, strings } from '@douyinfe/semi-foundation/sidebar/constants';
import cls from 'classnames';
import BaseComponent from '../_base/baseComponent';
import PropTypes, { ReactNodeLike } from 'prop-types';
import Container from './container';
import Options from './options';
import { pick } from 'lodash';
import { IconClose, IconCopyStroked } from '@douyinfe/semi-icons';
import Button from '../button';
import { CodeItem } from './widget/code';
import { FileItem } from './widget/file';
import copy from 'copy-text-to-clipboard';
import { ToastFactory } from '../toast';
import FileContent from './widget/file';
import CodeContent from './widget/code';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';

const prefixCls = cssClasses.SIDEBAR;

interface SideBarState {}

class Sidebar extends BaseComponent<SideBarProps, SideBarState> {
    static propTypes = {
        ...Container.propTypes,
        mode: PropTypes.string,
        activeKey: PropTypes.string,
        options: PropTypes.array,
        onActiveOptionChange: PropTypes.func,
        renderMainContent: PropTypes.func,
        renderDetailHeader: PropTypes.func,
        renderDetailContent: PropTypes.func,
        fileEditable: PropTypes.bool,
        onFileContentChange: PropTypes.func,
        onBackWard: PropTypes.func,
    };

    static FileContent = FileContent;
    static CodeContent = CodeContent;
    static FileItem = FileItem;
    static CodeItem = CodeItem;

    static Container = Container;

    static defaultProps = {
        mode: strings.MODE.MAIN,
        fileEditable: true
    };
    containerRef: React.RefObject<HTMLDivElement>;
    ToastInCustomContainer: any;

    constructor(props: SideBarProps) {
        super(props);
        this.containerRef = React.createRef<HTMLDivElement>();
        this.ToastInCustomContainer = ToastFactory.create({
            getPopupContainer: () => this.containerRef.current,
        });
    }

    renderOption = () => {
        const { activeKey, options, onActiveOptionChange, renderOptionItem } = this.props;
        return <Options
            options={options}
            renderOptionItem={renderOptionItem}
            onChange={onActiveOptionChange}
            activeKey={activeKey}
        />;
    }

    renderMain = () => {
        const activeKey = this.props.activeKey;
        const { renderMainContent } = this.props;
        return <div className={`${prefixCls}-main-content-wrapper`}>
            {this.renderOption()}
            <div className={`${prefixCls}-main-content`}>
                {renderMainContent?.(activeKey)}
            </div>
        </div>;
    }

    renderDetail = () => {
        const { renderDetailContent, detailContent = {}, imgUploadProps, fileEditable, onFileContentChange, mode } = this.props;
        const result = renderDetailContent?.(mode);
        if (result) {
            return result;
        }
        if (mode === 'code') {
            return <CodeItem {...detailContent} jsonViewerProps={{ height: '100%' }} />;
        } else if (mode === 'file') {
            return <FileItem {...detailContent} imgUploadProps={imgUploadProps} editable={fileEditable ?? true} onContentChange={onFileContentChange}/>;
        }
        return null;
    }

    renderContent = () => {
        const { mode } = this.props;
        return mode === strings.MODE.MAIN ? this.renderMain() : this.renderDetail();
    }

    renderTitle = () => {
        const { title, mode } = this.props;
        if (mode === strings.MODE.MAIN) {
            return title;
        }
        return null;
    }

    onDetailClose = (e: any) => {
        const { onBackWard } = this.props;
        onBackWard?.(e, strings.MODE.MAIN);
    }

    handleCopyDetailContent = (e: React.MouseEvent, locale: Locale['Sidebar']) => {
        const { detailContent, mode, onDetailContentCopy } = this.props;
        const content = detailContent.content;
        const res = copy(content);
        res && this.ToastInCustomContainer.success({
            content: locale.copySuccess,
        });
        onDetailContentCopy?.(e, content, res);
    }

    renderHeader = () => {
        const { renderDetailHeader, detailContent, mode } = this.props;
        const result = renderDetailHeader?.(mode, detailContent);
        if (result) {
            return result;
        }
        return <div className={`${prefixCls}-detail-header`}>
            <span className={`${prefixCls}-detail-header-left`}>
                <Button
                    theme='borderless'
                    type='tertiary'
                    icon={<IconClose />}
                    onClick={this.onDetailClose}
                />
                <span className={`${prefixCls}-detail-header-title`}>{detailContent.name}</span>
            </span>
            <span className={`${prefixCls}-detail-header-right`}>
                <LocaleConsumer componentName="Sidebar" >
                    {(locale: Locale['Sidebar']) => (<Button
                        theme='borderless'
                        type='tertiary'
                        icon={<IconCopyStroked />}
                        onClick={(e) => this.handleCopyDetailContent(e, locale)}
                    />)}
                </LocaleConsumer>
            </span>
        </div>;
    }

    render() {
        const { mode } = this.props;
        const containerProps = pick(this.props, ['title', 'style', 'visible', 'motion', 'minWidth', 'maxWidth', 'onCancel', 'afterVisibleChange', 'resizable', 'defaultSize', 'children', 'className', 'showClose']);
        return <Container
            {...containerProps}
            title={this.renderTitle()}
            containerRef={this.containerRef}
            className={cls({
                [containerProps.className]: containerProps.className,
                [`${prefixCls}-main`]: mode === strings.MODE.MAIN,
                [`${prefixCls}-detail`]: mode !== strings.MODE.MAIN,
            })}
            renderHeader={mode !== strings.MODE.MAIN ? this.renderHeader : undefined}
        >
            {this.renderContent()}
        </Container>;
    }
}

export default Sidebar;