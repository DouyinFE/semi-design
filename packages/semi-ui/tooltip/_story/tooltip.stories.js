import React, { useState, useMemo } from 'react';
import Tooltip from '../index';
import './story.scss';
import { Tag, Icon, IconButton, Switch, Checkbox, Radio, Button, Select, InputNumber } from '@douyinfe/semi-ui';

import InTableDemo from './InTable';
import EdgeDemo from './Edge';
import ScrollTooltip from './ScrollDemo';
import DangerousHtml from './DangerousHtml';
import ArrowPointAtCenter from './ArrowPointAtCenter';
import CustomContainer from './CustomContainer';
import ContainerPosition from './ContainerPosition';
import { IconList, IconSidebar, IconEdit } from '@douyinfe/semi-icons';

export default {
    title: 'Tooltip',
    parameters: {
        chromatic: { disableSnapshot: true },
    },
};

function test(visible) {
    console.log('visible Change:' + visible);
}

const ScrollDemo = function ScrollDemo(props = {}) {
    const tops = [
        ['topLeft', 'TL'],
        ['top', 'Top'],
        ['topRight', 'TR'],
    ];
    const lefts = [
        ['leftTop', 'LT'],
        ['left', 'Left'],
        ['leftBottom', 'LB'],
    ];
    const rights = [
        ['rightTop', 'RT'],
        ['right', 'Right'],
        ['rightBottom', 'RB'],
    ];
    const bottoms = [
        ['bottomLeft', 'BL'],
        ['bottom', 'Bottom'],
        ['bottomRight', 'BR'],
    ];
    const { tagStyle, ...restProps } = props;
    return (
        <div
            style={{
                paddingLeft: 40,
            }}
        >
            <div
                style={{
                    marginLeft: 40,
                    whiteSpace: 'nowrap',
                }}
            >
                {tops.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                        trigger={'click'}
                        {...restProps}
                    >
                        <Tag style={tagStyle}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div
                style={{
                    width: 40,
                    float: 'left',
                }}
            >
                {lefts.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                        trigger={'click'}
                        {...restProps}
                    >
                        <Tag style={tagStyle}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div
                style={{
                    width: 40,
                    marginLeft: 180,
                }}
            >
                {rights.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                        trigger={'click'}
                        {...restProps}
                    >
                        <Tag style={tagStyle}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div
                style={{
                    marginLeft: 40,
                    clear: 'both',
                    whiteSpace: 'nowrap',
                }}
            >
                {bottoms.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                        trigger={'click'}
                        {...restProps}
                    >
                        <Tag style={tagStyle}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

export const TooltipOnVisibleChange = () => {
    const [visible, setVisible] = useState(true);
    return (
        <div className="demo">
            <div>
                <label>受控</label>
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="top"
                    onVisibleChange={setVisible}
                    trigger="click"
                    visible={visible}
                >
                    <Tag>demo</Tag>
                </Tooltip>
            </div>

            <br />
            <br />
            <div>
                <label>非受控</label>
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="leftTop"
                    onVisibleChange={test}
                    trigger="click"
                >
                    <Tag>demo</Tag>
                </Tooltip>
            </div>
            <br />
            <br />

            {/* <Tooltip
       content={
           <article>
               <p>hi bytedance</p>
               <p>hi bytedance</p>
           </article>
       }
       position="rightBottom"
       onVisibleChange={test}
       trigger="hover"
    >
       <Tag>hover</Tag>
    </Tooltip>
    <br />
    <br />
    <Tooltip
       content={
           <article>
               <p>hi bytedance</p>
               <p>hi bytedance</p>
           </article>
       }
       mouseLeaveDelay={100}
       position="rightBottom"
       onVisibleChange={test}
       trigger="hover"
    >
       <Tag>hover with leave delay time</Tag>
    </Tooltip>
    <br />
    <br />
    <Tooltip
       content={
           <article>
               <p>hi bytedance</p>
               <p>hi bytedance</p>
           </article>
       }
       position="rightBottom"
       onVisibleChange={test}
       trigger="click"
    >
       <Tag>click</Tag>
    </Tooltip> */}
        </div>
    );
};

TooltipOnVisibleChange.story = {
    name: 'tooltip onVisibleChange',
};

export const GetPopupContainerDemo = () => (
    <div className="demo">
        <div className="content-layer" />
        <Tooltip
            content={
                <article>
                    <p>hi bytedance</p> <p>hi bytedance</p>
                </article>
            }
            position="bottom"
            visible
            trigger="custom"
            getPopupContainer={() => document.querySelector('.content-layer')}
        >
            <Tag>指定弹出层的容器</Tag>
            {/* <div className='content'></div> */}
        </Tooltip>
        <div>
            <label>给定容器为window，看是否报错</label>
            <Tooltip content={'单选'} position="top" getPopupContainer={() => window}>
                <Radio style={{ display: 'inline-flex' }}>单选</Radio>
            </Tooltip>
        </div>
    </div>
);

GetPopupContainerDemo.story = {
    name: 'tooltip指定弹出层的容器',
};

export const TooltipAll = () => (
    <div className="demo">
        <ScrollDemo />
        <div
            style={{
                padding: 120,
            }}
        >
            <ScrollDemo
                showArrow
                tagStyle={{
                    height: 80,
                }}
            />
        </div>
    </div>
);

TooltipAll.story = {
    name: 'tooltip All',
};

export const NoContent = () => (
    <div className="demo">
        <div
            style={{
                padding: 120,
            }}
        >
            <ScrollDemo showArrow content={''} />
        </div>
        <div
            style={{
                padding: 120,
            }}
        >
            <ScrollDemo
                showArrow
                tagStyle={{
                    minHeight: 80,
                    minWidth: 120,
                }}
                content={''}
            />
        </div>
    </div>
);

NoContent.story = {
    name: 'no content',
};

export const AdjustPosition = () => (
    <>
        <div className="adjust">
            <div className="wrapper">
                第一个滚动区域
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="rightBottom"
                    trigger="click"
                >
                    {/* <Tag className='topLeft'>topleft</Tag> */}
                    <div>test</div>
                </Tooltip>
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="topRight"
                    trigger="click"
                >
                    <Tag className="topRight">topRight</Tag>
                </Tooltip>
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="bottomLeft"
                    trigger="click"
                >
                    <Tag className="bottomLeft">bottomLeft</Tag>
                </Tooltip>
                <Tooltip
                    content={
                        <article>
                            <p>hi bytedance</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="bottomRight"
                    trigger="click"
                >
                    <Tag className="bottomRight">bottomRight</Tag>
                </Tooltip>
            </div>
        </div>
        <div className="adjust2">
            <div className="wrapper2">第二个滚动区域</div>
        </div>
    </>
);

AdjustPosition.story = {
    name: '自适应',
};

export const CompositeComponent = () => (
    <div
        style={{
            padding: 50,
        }}
    >
        <Tooltip
            content={
                <article>
                    <p>hi bytedance</p> <p>hi bytedance</p>
                </article>
            }
            position="top"
        >
            <IconList />
        </Tooltip>
        <Tooltip content={'收起'} position="top">
            <IconButton icon={<IconSidebar />} />
        </Tooltip>
        <Tooltip content={'开关'} position="top">
            <Switch />
        </Tooltip>
        <Tooltip content={'选择框'} position="top">
            <Checkbox
                style={{
                    display: 'inline-flex',
                }}
            >
                选择框
            </Checkbox>
        </Tooltip>
        <Tooltip content={'单选'} position="top">
            <Radio
                style={{
                    display: 'inline-flex',
                }}
            >
                单选
            </Radio>
        </Tooltip>
    </div>
);

CompositeComponent.story = {
    name: '复合组件',
};

export const WrapDisabledElems = () => (
    <div
        style={{
            padding: 50,
        }}
    >
        <Tooltip content="disabled">
            <IconButton disabled icon={<IconEdit />} />
        </Tooltip>
        <Tooltip content="disabled">
            <IconButton disabled icon={<IconEdit />} block />
        </Tooltip>
        <Tooltip content="disabled">
            <Button disabled block>
                编辑
            </Button>
        </Tooltip>
        <Tooltip content="disabled">
            <Button
                disabled
                style={{
                    display: 'block',
                }}
            >
                编辑
            </Button>
        </Tooltip>
    </div>
);

WrapDisabledElems.story = {
    name: 'wrap disabled elems',
};

export const InTable = () => (
    <div
        style={{
            marginTop: 50,
        }}
    >
        <InTableDemo />
    </div>
);

InTable.story = {
    name: 'in table',
};

export const _EdgeDemo = () => <EdgeDemo />;

_EdgeDemo.story = {
    name: 'edge demo',
};

export const ScrollTooltipDemo = () => <ScrollTooltip />;
ScrollTooltipDemo.story = {
    name: 'scroll demo and set popup container',
};
export const DangerousHtmlDemo = () => <DangerousHtml />;
DangerousHtmlDemo.story = {
    name: 'in dangerous html',
};
export const ArrowPointAtCenterDemo = () => <ArrowPointAtCenter />;
ArrowPointAtCenterDemo.story = {
    name: 'arrow point at center',
};
export const CustomContainerDemo = () => <CustomContainer />;
CustomContainerDemo.story = {
    name: 'custom container',
};
export const ContainerPositionDemo = () => <ContainerPosition />;
ContainerPositionDemo.story = {
    name: 'container observer',
};

export const QuickMoveMouse = () => {
    /**
     * mouseEnterDelay, mouseLeaveDelay 默认都为 50
     * mouseEnterDelay, mouseLeaveDelay 都为 0，快速滑动可能出现两个 tooltip 出现
     */
    const Demo = () => {
        const props = {
            mouseEnterDelay: 50,
            mouseLeaveDelay: 0,
        };
        return (
            <div className="demo">
                <div>
                    <Tooltip content={'1'} {...props}>
                        aaaaaaaaaaa
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'2'} {...props}>
                        bbbbbbbbbbb
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'3'} {...props}>
                        ccccccccccc
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'4'} {...props}>
                        aaaaaaaaaaa
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'5'} {...props}>
                        bbbbbbbbbbb
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'6'} {...props}>
                        ccccccccccc
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'7'} {...props}>
                        aaaaaaaaaaa
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'8'} {...props}>
                        bbbbbbbbbbb
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={'9'} {...props}>
                        ccccccccccc
                    </Tooltip>
                </div>
            </div>
        );
    };

    return <Demo />;
};

QuickMoveMouse.story = {
    name: '快速移动鼠标可见性',
};

export const MotionFalseFix1402 = () => {
    function Demo() {
        const Test = React.forwardRef((props, ref) => (
            <span {...props} ref={ref}>
                Test
            </span>
        ));
        return (
            <div>
                <Tooltip content={'hi bytedance'} motion={false}>
                    <Test />
                </Tooltip>
                <br />
                <br />
                <Tooltip content={'hi bytedance'}>
                    <Test />
                </Tooltip>
            </div>
        );
    }

    return <Demo />;
};

MotionFalseFix1402.story = {
    name: 'motion=false fix #1402',
};

export const DisabledWrapperCls = () => (
    <>
        <Tooltip wrapperClassName="test" content={'hi bytedance'}>
            <Button>按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName="test" content={'hi bytedance'}>
            <Button disabled>禁用的单个按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName="test" content={'hi bytedance'}>
            <Button>正常的多个按钮</Button>
            <Button>正常的多个按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName="test" content={'hi bytedance'}>
            <Select disabled placeholder="请选择业务线" style={{ width: 120 }}>
                <Select.Option value="abc">抖音</Select.Option>
                <Select.Option value="hotsoon">火山</Select.Option>
                <Select.Option value="jianying" disabled>
                    剪映
                </Select.Option>
                <Select.Option value="xigua">西瓜视频</Select.Option>
            </Select>
        </Tooltip>
        <br />
        <br />
    </>
);

DisabledWrapperCls.story = {
    name: 'disabledWrapperCls',
};

export const ShowArrow = () => {
    function Demo() {
        const Test = React.forwardRef((props, ref) => (
            <Tag {...props} ref={ref}>
                Test
            </Tag>
        ));
        return (
            <div>
                <h4>should show content and arrow when click</h4>
                <Tooltip showArrow trigger="click" content={'hi bytedance'}>
                    <Test />
                </Tooltip>
            </div>
        );
    }

    return <Demo />;
};

ShowArrow.story = {
    name: 'showArrow',
};

export const OnClickOutSideDemo = () => {
    let [v, setV] = useState(false);
    let clickOutSide = () => {
        console.log('clickOutSide');
        setV(false);
    };
    return (
        <>
            <Tooltip onClickOutSide={() => clickOutSide()} content={'hi bytedance'} visible={v} trigger="custom">
                <Button onClick={() => setV(true)}>按钮</Button>
            </Tooltip>
            <br />
            <br />
            <Tooltip onClickOutSide={() => console.log('clickOutSide')} content={'hi bytedance'} trigger="click">
                <Button>单个按钮</Button>
            </Tooltip>
        </>
    );
};
OnClickOutSideDemo.story = {
  name: 'OnClickOutSide',
};

export const AutoAdjustWithSpacing = () => {
    const [height, setHeight] = useState(84);
    const [key, setKey] = useState(1);
    const initSpacing = 8;
    const [spacing, setSpacing] = useState(initSpacing);

    const change = (height, hasSpace) => {
        setHeight(height);
        hasSpace ? setSpacing(initSpacing) : setSpacing(0);
        setKey(Math.random());
    };

    return (
        <div className="demo1">
            <div>
                <Tooltip
                    motion={false}
                    rePosKey={key}
                    // spacing={spacing}
                    content={
                        <article style={{ boxSizing: 'border-box', height: height }}>
                            <p>hi bytedance, + padding 20</p>
                            <p>hi bytedance</p>
                        </article>
                    }
                    position="top"
                    trigger="custom"
                    visible={true}
                >
                    <Tag>demo</Tag>
                </Tooltip>
            </div>
            <div style={{ marginTop: 200 }}>
                <Switch onChange={hasSpace => change(height, hasSpace)} checked={spacing === initSpacing ? true : false}></Switch>
                <InputNumber onChange={height => change(Number(height))} value={height} style={{ width: 200 }} />
            </div>
        </div>
    )
};

AutoAdjustWithSpacing.story = {
  name: 'AutoAdjustWithSpacing',
};
