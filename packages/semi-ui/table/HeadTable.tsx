/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { get, noop } from 'lodash';
import classnames from 'classnames';

import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import { Fixed, TableComponents, Scroll, BodyScrollEvent, ColumnProps } from './interface';

export interface HeadTableProps {
    [x: string]: any;
    anyColumnFixed?: boolean;
    bodyHasScrollBar?: boolean;
    columns?: ColumnProps[];
    components?: TableComponents;
    dataSource?: Record<string, any>[];
    fixed?: Fixed;
    handleBodyScroll?: React.EventHandler<BodyScrollEvent>;
    prefixCls?: string;
    forwardedRef?: React.MutableRefObject<HTMLDivElement> | ((instance: any) => void);
    scroll?: Scroll;
    selectedRowKeysSet: Set<any>;
    showHeader?: boolean;
    onDidUpdate?: (ref: React.MutableRefObject<any>) => void;
}

/**
 * When there are fixed columns, the header is rendered as a separate Table
 */
class HeadTable extends React.PureComponent<HeadTableProps> {
    static propTypes = {
        anyColumnFixed: PropTypes.bool,
        bodyHasScrollBar: PropTypes.bool,
        columns: PropTypes.array,
        components: PropTypes.object,
        dataSource: PropTypes.array,
        fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        handleBodyScroll: PropTypes.func,
        prefixCls: PropTypes.string,
        forwardedRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        scroll: PropTypes.shape({
            x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
            y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
        selectedRowKeysSet: PropTypes.instanceOf(Set).isRequired, // Useful when update is selected
        showHeader: PropTypes.bool,
        onDidUpdate: PropTypes.func,
    };

    static defaultProps = {
        handleBodyScroll: noop,
    };

    constructor(props: HeadTableProps = { selectedRowKeysSet: new Set() }) {
        super(props);
    }

    render() {
        const {
            scroll,
            prefixCls,
            fixed,
            forwardedRef,
            handleBodyScroll,
            columns,
            components,
            onDidUpdate,
            showHeader,
            anyColumnFixed,
            bodyHasScrollBar
        } = this.props;

        if (!showHeader) {
            return null;
        }

        const Table = get(components, 'header.outer', 'table');
        const x = get(scroll, 'x');
        const headStyle: Partial<React.CSSProperties> = {};
        const tableStyle: { width?: number | string } = {};

        if (x && !fixed) {
            tableStyle.width = x;
        }

        if (bodyHasScrollBar) {
            headStyle.overflowY = 'scroll';
        }

        const colgroup = <ColGroup columns={columns} prefixCls={prefixCls} />;
        const tableHeader = (
            <TableHeader {...this.props} columns={columns} components={components} onDidUpdate={onDidUpdate} />
        );

        return (
            <div
                key="headTable"
                style={headStyle}
                className={`${prefixCls}-header`}
                ref={forwardedRef}
                onScroll={handleBodyScroll}
            >
                <Table
                    style={tableStyle}
                    className={classnames(prefixCls, {
                        [`${prefixCls}-fixed`]: anyColumnFixed,
                    })}
                >
                    {colgroup}
                    {tableHeader}
                </Table>
            </div>
        );
    }
}

export default React.forwardRef<HTMLDivElement, HeadTableProps>((props, ref) => <HeadTable {...props} forwardedRef={ref} />);
