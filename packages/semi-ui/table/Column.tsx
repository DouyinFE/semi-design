import React from 'react';
import ColumnShape from './ColumnShape';
import { ColumnProps } from './interface';

export default class Column extends React.PureComponent<ColumnProps> {
    static propTypes = {
        ...ColumnShape,
    };

    static elementType = 'Column';

    constructor(props: ColumnProps = {}) {
        super(props);
    }

    render(): null {
        return null;
    }
}
