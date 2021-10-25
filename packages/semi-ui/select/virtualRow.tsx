import React from 'react';
export interface VirtualRowProps{
    index: number;
    data: Record<string, any>;
    style?: React.CSSProperties;
}
const VirtualRow = ({ index, data, style }: VirtualRowProps) => {
    const { visibileOptions } = data;
    const option = visibileOptions[index];
    return data.renderOption(option, index, style);
};

export default VirtualRow;
