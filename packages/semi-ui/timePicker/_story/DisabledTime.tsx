import React, { useState } from 'react';
import TimePicker from '../index';

/**
 * disabledTime 示例
 * 在 range 模式下，通过 disabledTime 可以对左右面板分别应用不同的禁用规则
 */
function DisabledTimeDemo() {
    const [value, setValue] = useState<string[]>([]);

    /**
     * disabledTime 函数接收两个参数：
     * - value: 当前面板的时间值
     * - panelType: 当前面板类型，'left' 或 'right'
     * 
     * 返回一个对象，包含：
     * - disabledHours: 返回需要禁用的小时数组
     * - disabledMinutes: 返回需要禁用的分钟数组（可选）
     * - disabledSeconds: 返回需要禁用的秒数数组（可选）
     */
    const disabledTime = (value: Date | Date[], panelType: 'left' | 'right') => {
        if (panelType === 'left') {
            // 左面板：禁用 0-8 点
            return {
                disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8],
            };
        } else {
            // 右面板：根据左面板选择的值禁用之前的时间
            // range 场景下 value 为 Date[]，我们取 value[0] 作为开始时间
            const start = Array.isArray(value) ? value[0] : value;
            if (start && start instanceof Date) {
                const leftHour = start.getHours();
                const leftMinute = start.getMinutes();
                
                // 禁用小于左面板选择的小时
                const disabledHours = [];
                for (let i = 0; i < leftHour; i++) {
                    disabledHours.push(i);
                }
                
                // 禁用相同时刻的小时中，小于左面板分钟的分钟
                const disabledMinutes = (hour: number) => {
                    if (hour === leftHour) {
                        const minutes = [];
                        for (let i = 0; i < leftMinute; i++) {
                            minutes.push(i);
                        }
                        return minutes;
                    }
                    return [];
                };

                return {
                    disabledHours: () => disabledHours,
                    disabledMinutes,
                };
            }
            
            // 默认：禁用 0-8 点
            return {
                disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8],
            };
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Range 模式下分别禁用左右面板</h3>
            <p>左面板：禁用 0-8 点</p>
            <p>右面板：根据左面板选择的值，禁用之前的时间</p>
            <TimePicker 
                type="timeRange" 
                disabledTime={disabledTime}
                value={value}
                onChange={(date: Date[], timeString: string[]) => {
                    setValue(timeString);
                    console.log('Selected:', date, timeString);
                }}
            />
        </div>
    );
}

export default DisabledTimeDemo;
