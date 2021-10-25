import React from 'react';
import Card from './card';

const ComponentList = props => {
    const list = props.code.split(',');
    return (
        <div className="semi-overview-list">
            {list.map((item, index) => (
                <Card name={item} key={item + index} />
            ))}
        </div>
    );
};

export default ComponentList;
