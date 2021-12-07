import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/tree/constants';
import { debounce, isFunction, isString } from 'lodash';
import { IconTreeTriangleDown, IconFile, IconFolder, IconFolderOpen } from '@douyinfe/semi-icons';
import { Checkbox } from '../checkbox';
import TreeContext from './treeContext';
import Spin from '../spin';
import { TreeNodeProps, TreeNodeState } from './interface';

const prefixcls = cssClasses.PREFIX_OPTION;

export default class TreeNode extends PureComponent<TreeNodeProps, TreeNodeState> {
    static contextType = TreeContext;

    static propTypes = {
        expanded: PropTypes.bool,
        selected: PropTypes.bool,
        checked: PropTypes.bool,
        halfChecked: PropTypes.bool,
        active: PropTypes.bool,
        disabled: PropTypes.bool,
        loaded: PropTypes.bool,
        loading: PropTypes.bool,
        isLeaf: PropTypes.bool,
        pos: PropTypes.string,
        children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        icon: PropTypes.node,
        directory: PropTypes.bool,
        keyword: PropTypes.string,
        treeNodeFilterProp: PropTypes.string,
        selectedKey: PropTypes.string,
        motionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    };

    static defaultProps = {
        selectedKey: '',
        motionKey: '',
    };

    debounceSelect: any;
    refNode: HTMLElement;

    constructor(props: TreeNodeProps) {
        super(props);
        this.state = {};
        this.debounceSelect = debounce(this.onSelect, 500, {
            leading: true,
            trailing: false
        });
    }

    onSelect = (e: React.MouseEvent) => {
        const { onNodeSelect } = this.context;
        onNodeSelect(e, this.props);
    };

    onExpand = (e: React.MouseEvent) => {
        const { onNodeExpand } = this.context;
        e && e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        onNodeExpand(e, this.props);
    };

    onCheck = (e: React.MouseEvent) => {
        if (this.isDisabled()) {
            return;
        }
        const { onNodeCheck } = this.context;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        onNodeCheck(e, this.props);
    };

    onContextMenu = (e: React.MouseEvent) => {
        const { onNodeRightClick } = this.context;
        onNodeRightClick(e, this.props);
    };

    onClick = (e: React.MouseEvent) => {
        const { expandAction } = this.context;
        if (expandAction === 'doubleClick') {
            this.debounceSelect(e);
            return;
        }
        this.onSelect(e);
        if (expandAction === 'click') {
            this.onExpand(e);
        }
    };

    onDoubleClick = (e: React.MouseEvent) => {
        const { expandAction, onNodeDoubleClick } = this.context;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (isFunction(onNodeDoubleClick)) {
            onNodeDoubleClick(e, this.props);
        }
        if (expandAction === 'doubleClick') {
            this.onExpand(e);
        }
    };

    onDragStart = (e: React.DragEvent) => {
        const { onNodeDragStart } = this.context;
        e.stopPropagation();
        onNodeDragStart(e, { ...this.props, nodeInstance: this.refNode });

        try {
            // ie throw error
            // firefox-need-it
            e.dataTransfer.setData('text/plain', '');
        } catch (error) {
            // empty
        }
    };

    onDragEnter = (e: React.DragEvent) => {
        const { onNodeDragEnter } = this.context;
        e.preventDefault();
        e.stopPropagation();
        onNodeDragEnter(e, { ...this.props, nodeInstance: this.refNode });
    };

    onDragOver = (e: React.DragEvent) => {
        const { onNodeDragOver } = this.context;
        e.preventDefault();
        e.stopPropagation();
        onNodeDragOver(e, { ...this.props, nodeInstance: this.refNode });
    };

    onDragLeave = (e: React.DragEvent) => {
        const { onNodeDragLeave } = this.context;
        e.stopPropagation();
        onNodeDragLeave(e, { ...this.props, nodeInstance: this.refNode });
    };

    onDragEnd = (e: React.DragEvent) => {
        const { onNodeDragEnd } = this.context;
        e.stopPropagation();
        onNodeDragEnd(e, { ...this.props, nodeInstance: this.refNode });
    };

    onDrop = (e: React.DragEvent) => {
        const { onNodeDrop } = this.context;
        e.preventDefault();
        e.stopPropagation();
        onNodeDrop(e, { ...this.props, nodeInstance: this.refNode });
    };

    getNodeChildren = () => {
        const { children } = this.props;
        return children || [];
    };

    isLeaf = () => {
        const { isLeaf, loaded } = this.props;
        const { loadData } = this.context;
        const hasChildren = this.getNodeChildren().length !== 0;

        if (isLeaf === false) {
            return false;
        }

        return isLeaf || (!loadData && !hasChildren) || (loadData && loaded && !hasChildren);
    };

    isDisabled = () => {
        const { disabled } = this.props;
        const { treeDisabled } = this.context;

        if (disabled === false) {
            return false;
        }

        return Boolean(treeDisabled || disabled);
    };

    renderArrow() {
        const showIcon = !this.isLeaf();
        const { loading } = this.props;
        if (loading) {
            return <Spin wrapperClassName={`${prefixcls}-spin-icon`} />;
        }
        if (showIcon) {
            return (
                <IconTreeTriangleDown
                    className={`${prefixcls}-expand-icon`}
                    size="small"
                    onClick={this.onExpand}
                />
            );
        }
        return (
            <span className={`${prefixcls}-empty-icon`} />
        );
    }

    renderCheckbox() {
        const { checked, halfChecked } = this.props;
        const disabled = this.isDisabled();
        return (
            <div onClick={this.onCheck}>
                <Checkbox
                    indeterminate={halfChecked}
                    checked={checked}
                    disabled={Boolean(disabled)}
                />
            </div>
        );
    }

    renderIcon() {
        const {
            directory,
            treeIcon
        } = this.context;
        const { expanded, icon } = this.props;
        const hasChild = !this.isLeaf();
        const hasIcon = icon || treeIcon;
        let itemIcon;
        if (hasIcon || directory) {
            if (hasIcon) {
                itemIcon = icon || treeIcon;
            } else {
                if (!hasChild) {
                    itemIcon = <IconFile className={`${prefixcls}-item-icon`} />;
                } else {
                    // eslint-disable-next-line max-len
                    itemIcon = expanded ? <IconFolderOpen className={`${prefixcls}-item-icon`} /> : <IconFolder className={`${prefixcls}-item-icon`} />;
                }
            }
        }
        return itemIcon;
    }

    renderEmptyNode() {
        const { emptyContent } = this.props;
        const wrapperCls = cls(prefixcls, {
            [`${prefixcls}-empty`]: true,
        });
        return (
            <ul className={wrapperCls}>
                <span className={`${prefixcls}-label ${prefixcls}-label-empty`}>
                    {emptyContent}
                </span>
            </ul>
        );
    }

    renderRealLabel = () => {
        const { renderLabel } = this.context;
        const { label, keyword, data, filtered, treeNodeFilterProp } = this.props;
        if (isFunction(renderLabel)) {
            return renderLabel(label, data);
        } else if (isString(label) && filtered && keyword && treeNodeFilterProp === 'label') {
            const content: React.ReactNode[] = [];
            label.split(keyword).forEach((node, index) => {
                if (index > 0) {
                    content.push(
                        <span className={`${prefixcls}-highlight`} key={index}>
                            {keyword}
                        </span>
                    );
                }
                content.push(node);
            });
            return content;
        } else {
            return label;
        }
    };

    setRef = (node: HTMLElement) => {
        this.refNode = node;
    };

    // eslint-disable-next-line max-lines-per-function
    render() {
        const {
            eventKey,
            expanded,
            selected,
            checked,
            halfChecked,
            loading,
            active,
            level,
            empty,
            filtered,
            treeNodeFilterProp,
            // eslint-disable-next-line no-unused-vars
            display,
            style,
            ...rest
        } = this.props;
        if (empty) {
            return this.renderEmptyNode();
        }
        const {
            multiple,
            draggable,
            renderFullLabel,
            dragOverNodeKey,
            dropPosition,
            labelEllipsis
        } = this.context;
        const disabled = this.isDisabled();
        const dragOver = dragOverNodeKey === eventKey && dropPosition === 0;
        const dragOverGapTop = dragOverNodeKey === eventKey && dropPosition === -1;
        const dragOverGapBottom = dragOverNodeKey === eventKey && dropPosition === 1;
        const nodeCls = cls(prefixcls, {
            [`${prefixcls}-level-${level + 1}`]: true,
            [`${prefixcls}-collapsed`]: !expanded,
            [`${prefixcls}-disabled`]: Boolean(disabled),
            [`${prefixcls}-selected`]: selected,
            [`${prefixcls}-active`]: !multiple && active,
            [`${prefixcls}-ellipsis`]: labelEllipsis,
            [`${prefixcls}-filtered`]: filtered && treeNodeFilterProp !== 'label',
            [`${prefixcls}-drag-over`]: !disabled && dragOver,
            [`${prefixcls}-draggable`]: !disabled && draggable && !renderFullLabel,
            // When draggable + renderFullLabel is enabled, the default style
            [`${prefixcls}-fullLabel-draggable`]: !disabled && draggable && renderFullLabel,
            // When draggable + renderFullLabel is turned on, the style of dragover
            [`${prefixcls}-fullLabel-drag-over-gap-top`]: !disabled && dragOverGapTop && renderFullLabel,
            [`${prefixcls}-fullLabel-drag-over-gap-bottom`]: !disabled && dragOverGapBottom && renderFullLabel,
        });
        const labelProps = {
            onClick: this.onClick,
            onContextMenu: this.onContextMenu,
            onDoubleClick: this.onDoubleClick,
            className: nodeCls,
            onExpand: this.onExpand,
            data: rest.data,
            level,
            onCheck: this.onCheck,
            style,
            expandIcon: this.renderArrow(),
            checkStatus: {
                checked,
                halfChecked,
            },
            expandStatus: {
                expanded,
                loading,
            },
        };

        const dragProps = {
            onDoubleClick: this.onDoubleClick,
            onDragStart: draggable ? this.onDragStart : undefined,
            onDragEnter: draggable ? this.onDragEnter : undefined,
            onDragOver: draggable ? this.onDragOver : undefined,
            onDragLeave: draggable ? this.onDragLeave : undefined,
            onDrop: draggable ? this.onDrop : undefined,
            onDragEnd: draggable ? this.onDragEnd : undefined,
            draggable: (!disabled && draggable) || undefined,
        };

        if (renderFullLabel) {
            const customLabel = renderFullLabel({ ...labelProps });
            if (draggable) {
                return React.cloneElement(customLabel, {
                    ref: this.setRef,
                    ...dragProps
                });
            } else {
                return customLabel;
            }
        }
        const labelCls = cls(`${prefixcls}-label`, {
            [`${prefixcls}-drag-over-gap-top`]: !disabled && dragOverGapTop,
            [`${prefixcls}-drag-over-gap-bottom`]: !disabled && dragOverGapBottom,
        });
        return (
            <li
                className={nodeCls}
                role="treenode"
                data-key={eventKey}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
                onDoubleClick={this.onDoubleClick}
                ref={this.setRef}
                style={style}
                {...dragProps}
            >
                {this.renderArrow()}
                <span
                    className={labelCls}
                >
                    {multiple ? this.renderCheckbox() : null}
                    {this.renderIcon()}
                    <span className={`${prefixcls}-label-text`}>{this.renderRealLabel()}</span>
                </span>
            </li>
        );
    }
}
