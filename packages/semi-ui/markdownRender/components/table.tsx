import * as React from 'react';
import { PropsWithChildren } from 'react';
import { get } from 'lodash';
import Table, { TableProps } from '../../table';
import { omit } from 'lodash';



const table = (props: PropsWithChildren<TableProps>) => {

    const { children } = props;
    const toArray = value => Array.isArray(value) ? value : [value];
    const columnsFiber = toArray(get(children[0], 'props.children.props.children'));
    const dataFiber = toArray(get(children[1], 'props.children'));

    const titles: string[] = columnsFiber.map(item => item?.props?.children || "");
    const tableDataSource: any[] = [];
    for (let i = 0;i < dataFiber.length;i++) {
        let item: Record<string, string> = {
            key: String(i)
        };
        dataFiber[i]?.props.children?.forEach?.((child, index) => {
            item[titles[index]] = child?.props?.children ?? "";
        });
        tableDataSource.push(item);
    }


    return <Table dataSource={tableDataSource} columns={titles.map(title => {
        return {
            title,
            dataIndex: title
        };
    })} {...omit(props, 'children')}/>;
};

export default table;
