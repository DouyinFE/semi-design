import * as React from 'react'
import { PropsWithChildren } from 'react';
import Typography from '@douyinfe/semi-ui/typography';
import { get } from 'lodash-es';



export default (props:PropsWithChildren<{}>)=>{

    console.log(props);

    const {children} = props;
    const toArray = value => Array.isArray(value) ? value : [value];
    const columnsFiber = toArray(get(children[0], 'props.children.props.children'));
    const dataFiber = toArray(get(children[1], 'props.children'));
    const getColumnsFromFiber = columnsFiber => {
        const columnsTitle = columnsFiber.map(column => get(column, 'props.children'));
        const columns = columnsTitle.map((title, index) => ({ title, dataIndex: `col-${index}` }));
        return columns;
    }
    const getDataFromFiber = dataFiber => {
        const dataSource = dataFiber.map((rowFiber, rowIndex) => {
            const row = toArray(get(rowFiber, 'props.children'));
            const record = {};
            row.forEach((colFiber, colIndex) => {
                const colContent = get(colFiber, 'props.children');
                record[`col-${colIndex}`] = colContent;
            });
            return { key: `row-${rowIndex}`, ...record };
        })
        return dataSource;
    }

    let data:any = {}



    try {
        const columns = getColumnsFromFiber(columnsFiber);
        const dataSource = getDataFromFiber(dataFiber);
        console.log(columns,dataSource);
    } catch (error) {

    }


    return <table>{props.children}</table>
}
