import React from 'react';
import { Resizable } from 'react-resizable';

export interface ResizableHeaderCellProps {
    [x: string]: any;
    onResize?: ResizeFn;
    onResizeStart?: ResizeFn;
    onResizeStop?: ResizeFn;
    width?: number | string
}

class ResizableHeaderCell extends React.PureComponent<ResizableHeaderCellProps> {
    render() {
        const { onResize, onResizeStart, onResizeStop, width, ...restProps } = this.props;

        if (typeof width !== 'number') {
            return <th {...restProps} />;
        }

        let { children } = restProps;

        // Fragment must be used here, otherwise there will be an error (seemingly a react-resizable@1.9.0 problem)
        children = React.Children.map(children, (child, index) => <React.Fragment key={index}>{child}</React.Fragment>);

        return (
            <Resizable
                width={width}
                height={0}
                onResize={onResize}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop}
                draggableOpts={{ enableUserSelectHack: false }}
            >
                <th {...restProps}>
                    {children}
                </th>
            </Resizable>
        );
    }
}

export type ResizeFn = (e: React.SyntheticEvent) => any;

export default ResizableHeaderCell;
