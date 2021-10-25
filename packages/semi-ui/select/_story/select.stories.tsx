import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from '../index';
import classNames from 'classnames';
import { optionRenderProps } from '@douyinfe/semi-ui/select/index';
import { Checkbox } from '../../index';

const stories = storiesOf('Select', module);

let optionList = [
    { value: 'tony', label: 'Ironman' },
    { value: 'Thor', label: 'Thor' },
    { value: 'steve', label: 'Caption' },
    { value: 'peter', label: 'SpiderBoy' },
];

stories.add('Select', () => (
    <>
        <Select style={{ width: 200 }}>
            <Select.Option value="1"></Select.Option>
            <Select.Option value="2"></Select.Option>
        </Select>
    </>
));

const RenderOptionDemo = () => {
    const renderOptionItem = (renderProps: optionRenderProps) => {
        const {
            disabled,
            selected,
            label,
            value,
            focused,
            className,
            style,
            onMouseEnter,
            onClick,
            ...rest
        } = renderProps;

        const optionCls = classNames({
            ['custom-option-render']: true,
            ['custom-option-render-focused']: focused,
            ['custom-option-render-disabled']: disabled,
            ['custom-option-render-selected']: selected,
        });
        // Notice：
        // 1.props传入的style需在wrapper dom上进行消费，否则在虚拟化场景下会无法正常使用
        // 2.选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从props中获取到相对的boolean值
        // 3.onMouseEnter需在wrapper dom上绑定，否则上下键盘操作时显示会有问题

        return (
            <div style={style} className={optionCls} onClick={() => onClick()} onMouseEnter={e => onMouseEnter()}>
                <Checkbox checked={selected} />
                <div className="option-right">{label}</div>
            </div>
        );
    };

    return (
        <Select
            filter
            dropdownClassName="components-select-demo-renderOptionItem"
            optionList={optionList}
            style={{ width: 300 }}
            renderOptionItem={renderOptionItem}
        />
    );
};
