import * as React from 'react';
import { PropsWithChildren } from 'react';
import { get } from 'lodash';
import Table, { TableProps } from '../../table';
import { omit } from 'lodash';



const table = (props: PropsWithChildren<TableProps>) => {

    const { children } = props;

    // In MDX/React, `children` could be a single element, an array, or contain whitespace text nodes.
    // Also, when a row has only one column, `tr.props.children` is usually a single ReactElement
    // instead of an array. We normalize everything via `React.Children.toArray` to avoid losing data.
    const elementChildren = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement[];

    const thead = elementChildren.find(node => node.type === 'thead') ?? elementChildren[0];
    const tbody = elementChildren.find(node => node.type === 'tbody') ?? elementChildren[1];

    const headTr = React.Children.toArray(get(thead, 'props.children')).find(React.isValidElement) as React.ReactElement | undefined;
    const columnsFiber = React.Children.toArray(get(headTr, 'props.children'));

    const dataFiber = React.Children.toArray(get(tbody, 'props.children'));

    const titlesColumns = columnsFiber.map((column: any, i) => {
        return {
            dataIndex: String(i),
            title: column?.props?.children ?? ""
        };
    });
    const tableDataSource: any[] = [];
    for (let i = 0;i < dataFiber.length;i++) {
        let item: Record<string, React.ReactNode> = {
            key: String(i)
        };

        const rowCells = React.Children.toArray((dataFiber[i] as any)?.props?.children);
        rowCells.forEach((child: any, index: number) => {
            item[String(index)] = child?.props?.children ?? "";
        });
        tableDataSource.push(item);
    }

    return <Table dataSource={tableDataSource} columns={titlesColumns} {...omit(props, 'children')}/>;
};

export default table;
