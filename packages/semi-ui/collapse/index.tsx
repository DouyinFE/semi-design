import React, { CSSProperties } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/collapse/constants';
import CollapseFoundation, {
    ArgsType,
    CollapseAdapter,
    CollapseProps,
    CollapseState
} from '@douyinfe/semi-foundation/collapse/foundation';
import BaseComponent from '../_base/baseComponent';
import CollapsePanel from './item';
import '@douyinfe/semi-foundation/collapse/collapse.scss';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import { isEqual } from 'lodash';
import CollapseContext from './collapse-context';

export { CollapsePanelProps } from './item';

export interface CollapseReactProps extends CollapseProps{
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
    style?: CSSProperties;
    onChange?: (activeKey: CollapseProps['activeKey'], e: React.MouseEvent) => void;
}


export { CollapseState };

class Collapse extends BaseComponent<CollapseReactProps, CollapseState> {
    static Panel = CollapsePanel;

    static propTypes = {
        activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        accordion: PropTypes.bool,
        onChange: PropTypes.func,
        expandIcon: PropTypes.node,
        collapseIcon: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
        keepDOM: PropTypes.bool,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        expandIconPosition: PropTypes.oneOf(strings.iconPosition)
    };

    static defaultProps = {
        defaultActiveKey: '',
        onChange: noop,
        expandIconPosition: 'right'
    };

    constructor(props: CollapseReactProps) {
        super(props);
        this.foundation = new CollapseFoundation(this.adapter);
        const initKeys = this.foundation.initActiveKey();
        this.state = {
            activeSet: new Set(initKeys)
        };
        this.onChange = this.onChange.bind(this);
    }

    get adapter(): CollapseAdapter {
        return {
            ...super.adapter,
            handleChange: (activeKey: CollapseProps['activeKey'], e: React.MouseEvent) => this.props.onChange(activeKey, e),
            addActiveKey: (activeSet: CollapseState['activeSet']) => this.setState({ activeSet }),
        };
    }

    static getDerivedStateFromProps(props: CollapseReactProps, state: CollapseState) {
        if (props.activeKey) {
            const keys = Array.isArray(props.activeKey) ? props.activeKey : [props.activeKey];
            const newSet = new Set(keys);
            if (!isEqual(newSet, state.activeSet)) {
                return {
                    ...state,
                    activeSet: newSet,
                };
            }
            return state;
        }
        return state;
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    onChange = (activeKey: string, e: React.MouseEvent) => {
        this.foundation.handleChange(activeKey, e);
    };

    render() {
        // eslint-disable-next-line max-len
        const { defaultActiveKey, accordion, style, motion, className, keepDOM, expandIconPosition, expandIcon, collapseIcon, children, ...rest } = this.props;
        const clsPrefix = cls(cssClasses.PREFIX, className);
        const { activeSet } = this.state;
        return (
            <div className={clsPrefix} style={style}>
                <CollapseContext.Provider
                    value={{
                        activeSet,
                        expandIcon,
                        collapseIcon,
                        keepDOM,
                        expandIconPosition,
                        onClick: this.onChange,
                        motion
                    }}
                >
                    {children}
                </CollapseContext.Provider>
            </div>
        );
    }
}

export default Collapse;