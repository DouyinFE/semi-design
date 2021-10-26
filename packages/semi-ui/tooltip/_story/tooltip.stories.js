import React, { useState, useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from '../index';
import './story.scss';
import { Tag, Icon, IconButton, Switch, Checkbox, Radio, Button, Select } from '@douyinfe/semi-ui';

import InTableDemo from './InTable';
import EdgeDemo from './Edge';
import ScrollTooltip from './ScrollDemo';
import DangerousHtml from './DangerousHtml';
import ArrowPointAtCenter from './ArrowPointAtCenter';
import CustomContainer from './CustomContainer';
import ContainerPosition from './ContainerPosition';
// // stories.addDecorator(withKnobs);;
import { IconList, IconSidebar, IconEdit } from '@douyinfe/semi-icons';

const stories = storiesOf('Tooltip', module); // // stories.addDecorator(withKnobs);;

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

stories.add('tooltip onVisibleChange', () => {
    const [visible, setVisible] = useState();
    return (
    <div className="demo">
        <div>
            <label>非受控</label>
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
                <Tag>demo</Tag>
            </Tooltip>
        </div>
        <div>
            <label>受控</label>
            <Tooltip
                content={
                    <article>
                        <p>hi bytedance</p>
                        <p>hi bytedance</p>
                    </article>
                }
                position="rightBottom"
                onVisibleChange={setVisible}
                trigger="click"
                visible={visible}
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
)});

stories.add('tooltip指定弹出层的容器', () => (
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
));
stories.add('tooltip All', () => (
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
));
stories.add('no content', () => (
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
));
stories.add('自适应', () => (
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
));
stories.add('复合组件', () => (
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
));
stories.add('wrap disabled elems', () => (
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
));
stories.add('in table', () => (
    <div
        style={{
            marginTop: 50,
        }}
    >
        <InTableDemo />
    </div>
));
stories.add('edge demo', () => <EdgeDemo />);
stories.add(`scroll demo and set popup container`, () => <ScrollTooltip />);
stories.add(`in dangerous html`, () => <DangerousHtml />);
stories.add(`arrow point at center`, () => <ArrowPointAtCenter />);
stories.add(`custom container`, () => <CustomContainer />);
stories.add(`container observer`, () => <ContainerPosition />);

stories.add('快速移动鼠标可见性', () => {
    /**
     * mouseEnterDelay, mouseLeaveDelay 默认都为 50
     * mouseEnterDelay, mouseLeaveDelay 都为 0，快速滑动可能出现两个 tooltip 出现
     */
    const Demo = () => {
        const props = {
            mouseEnterDelay: 50,
            mouseLeaveDelay: 0,
        }
        return (
          <div className="demo">
            <div>
                <Tooltip content={'1'} {...props}>aaaaaaaaaaa</Tooltip>
            </div>
            <div>
                <Tooltip content={'2'} {...props}>bbbbbbbbbbb</Tooltip>
            </div>
            <div>
                <Tooltip content={'3'} {...props}>ccccccccccc</Tooltip>
            </div>
            <div>
                <Tooltip content={'4'} {...props}>aaaaaaaaaaa</Tooltip>
            </div>
            <div>
                <Tooltip content={'5'} {...props}>bbbbbbbbbbb</Tooltip>
            </div>
            <div>
                <Tooltip content={'6'} {...props}>ccccccccccc</Tooltip>
            </div>
            <div>
                <Tooltip content={'7'} {...props}>aaaaaaaaaaa</Tooltip>
            </div>
            <div>
                <Tooltip content={'8'} {...props}>bbbbbbbbbbb</Tooltip>
            </div>
            <div>
                <Tooltip content={'9'} {...props}>ccccccccccc</Tooltip>
            </div>
          </div>
        )
      }
      
    return <Demo />
});

stories.add('motion=false fix #1402', () => {

    function Demo() {
        const Test = React.forwardRef((props, ref) => (
            <span {...props} ref={ref}>
                Test
            </span>
        ));
        return (
            <div>
                <Tooltip content={'hi bytedance'} motion={false} >
                    <Test />
                </Tooltip>
                <br /><br />
                <Tooltip content={'hi bytedance'}>
                    <Test />
                </Tooltip>
            </div>
        );
    }
      
    return <Demo />
});

stories.add('disabledWrapperCls', () => (
    <>
        <Tooltip wrapperClassName='test' content={'hi bytedance'}>
            <Button>按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName='test' content={'hi bytedance'}>
            <Button disabled>禁用的单个按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName='test' content={'hi bytedance'}>
            <Button>正常的多个按钮</Button>
            <Button>正常的多个按钮</Button>
        </Tooltip>
        <br />
        <br />
        <Tooltip wrapperClassName='test' content={'hi bytedance'}>
            <Select disabled placeholder='请选择业务线' style={{ width: 120 }}>
                <Select.Option value='abc'>抖音</Select.Option>
                <Select.Option value='hotsoon'>火山</Select.Option>
                <Select.Option value='jianying' disabled>剪映</Select.Option>
                <Select.Option value='xigua'>西瓜视频</Select.Option>
            </Select>
        </Tooltip>
        <br />
        <br />
    </>
));

stories.add('showArrow', () => {

    function Demo() {
        const Test = React.forwardRef((props, ref) => (
            <Tag {...props} ref={ref}>
                Test
            </Tag>
        ));
        return (
            <div>
                <h4>should show content and arrow when click</h4>
                <Tooltip showArrow trigger="click" content={'hi bytedance'} >
                    <Test />
                </Tooltip>
            </div>
        );
    }
      
    return <Demo />
})