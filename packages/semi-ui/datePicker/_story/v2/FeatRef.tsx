import React, { useRef, useState } from 'react';
import BaseDatePicker from '../../datePicker';
import { DatePicker, Tabs } from '../../../index';

FeatRef.storyName = 'ref methods';
export default function FeatRef() {
    const ref = useRef<BaseDatePicker>();
    const ref2 = useRef<BaseDatePicker>();
    const TabPane = Tabs.TabPane;

    const handleClickOutside = () => {
        console.log('click outside');
    };

    const handleTabChange = (activeKey: string) => {
        if (activeKey === '1') {
            ref2.current?.close();
        }
        if (activeKey === '2') {
            ref.current?.close();
        }
    };

    return (
        <>
            <button onClick={() => ref.current.open()}>open</button>
            <button onClick={() => ref.current.close()}>close</button>
            <Tabs type="line" onChange={handleTabChange}>
                <TabPane tab="文档" itemKey="1">
                    <DatePicker motion={false} type="dateTime" needConfirm ref={ref} onClickOutSide={handleClickOutside} />
                </TabPane>
                <TabPane tab="快速起步" itemKey="2">
                    <DatePicker motion={false} type="dateTimeRange" needConfirm ref={ref2} onClickOutSide={handleClickOutside} />
                </TabPane>
            </Tabs>
        </>
    );
}
