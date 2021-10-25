import React from 'react';
import Tabs from '../index';
import TabPane from '../TabPane';

const Demo = () => {
    const tabPaneList = [
        'a',
        'b',
        'c'
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1"
                tabPaneMotion>
                {
                    tabPaneList.map((item, index) => {
                        return (
                            <TabPane tab={item} itemKey={index.toString()} key={item}>
                                { item + index }
                            </TabPane>
                        )
                    })
                }
            </Tabs>
        </div>
    )
}

export default Demo