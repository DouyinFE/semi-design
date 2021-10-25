import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/datePicker/constants';
import Button from '../button/index';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import { PresetsType, PresetType } from '@douyinfe/semi-foundation/datePicker/foundation';

const prefixCls = cssClasses.PREFIX;

export interface QuickControlProps {
    presets: PresetsType;
    onPresetClick: (preset: PresetType, e: React.MouseEvent) => void;
    type: string;
}

class QuickControl extends PureComponent<QuickControlProps> {
    static propTypes = {
        presets: PropTypes.array,
        onPresetClick: PropTypes.func,
        type: PropTypes.string
    };

    static defaultProps = {
        presets: [] as PresetsType,
        onPresetClick: noop,
    };

    render() {
        const { presets, onPresetClick, type } = this.props;
        const wrapperCls = classNames(`${prefixCls}-quick-control`, {
            [`${prefixCls}-quick-control-${type}`]: type
        });
        const itemCls = classNames(`${prefixCls}-quick-control-item`);
        if (!presets.length) {
            return null;
        }
        return (
            <div className={wrapperCls}>
                {presets.map((item, index) => {
                    const _item: PresetType = typeof item === 'function' ? item() : item;
                    return (
                        <div className={itemCls} onClick={e => onPresetClick(_item, e)} key={index}>
                            <Button size="small" theme="borderless" type="primary">
                                <span>{_item.text}</span>
                            </Button>
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default QuickControl;
