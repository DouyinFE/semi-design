import React from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import withPropsCombinations from 'react-storybook-addon-props-combinations';
import Dropdown from '../index';
import Avatar from '../../avatar';
import Button from '@douyinfe/semi-ui/button/index';
import InTableDemo from './inTable';
import AutoClose from './AutoClose';
import MultiDropdown from './MultiDropdown';
import DisabledItem from './DisabledItem';
import InHoverElements from './InHoverElements';
import WrapAvatar from './WrapAvatar';
import { IconChevronDown, IconBox, IconSimilarity } from '@douyinfe/semi-icons';

const stories = storiesOf('Dropdown', module); // stories.addDecorator(withKnobs);;

let style = {
    display: 'inline-block',
    padding: '20px',
};

const change = visible => {
    debugger;
};

stories.add('Dropdown 1', () => (
    <div>
        <div style={style}>
            <Dropdown
                trigger="click"
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>1111</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item selected={true}>
                            2222 What if the text is super long? Longer than whatever you've known
                        </Dropdown.Item>
                        <Dropdown.Item>It looks OK</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <div>分割线</div>
            </Dropdown>
        </div>

        <div style={style}>
            <Dropdown
                onVisibleChange={change}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>333</Dropdown.Item>
                        <Dropdown.Item>44444</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                hover
            </Dropdown>
        </div>

        <br />

        <div style={style}>
            <Dropdown
                position="bottomRight"
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>333</Dropdown.Item>
                        <Dropdown.Item>44444</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                hover bottomRight
            </Dropdown>
        </div>

        <div style={style}>
            <Dropdown
                position="bottomLeft"
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>333</Dropdown.Item>
                        <Dropdown.Item>44444</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                hover bottomLeft
            </Dropdown>
        </div>

        {/* <div style={style}>
       <Dropdown content="ies vigosss">
           bottom hover
       </Dropdown>
    </div>
    <div style={style}>
       <Dropdown trigger="click" content="ies vigo" trigger="click">
           bottom click
       </Dropdown>
    </div>
    <div style={style}>
       <Dropdown content={<Button type="warning">btn</Button>}  trigger="click">
           content is Node
       </Dropdown>
    </div> */}
    </div>
));
stories.add('Dropdown 2', () => {
    return (
        <div>
            <Dropdown
                trigger="click"
                position="bottomLeft"
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>1111</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item selected={true}>
                            2222 What if the text is super long? Longer than whatever you've known
                        </Dropdown.Item>
                        <Dropdown.Item>It looks OK</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Open dropdown</Button>
            </Dropdown>
        </div>
    );
});
stories.add('Avatar', () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row-reverse',
            }}
        >
            <Dropdown
                autoAdjustOverflow={true}
                trigger="click"
                position="bottomRight"
                getPopupContainer={() => document.querySelector('#dropdown-container')}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>1111</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item selected={true}>
                            2222 What if the text is super long? Longer than whatever you've known
                        </Dropdown.Item>
                        <Dropdown.Item>It looks OK</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <div
                    style={{
                        display: 'inline-block',
                    }}
                >
                    <Avatar size="small" src="" />
                    <IconChevronDown />
                </div>
            </Dropdown>
            <div id="dropdown-container" />
        </div>
    );
});
stories.add('Dropdown onVisibleChange', () => {
    return (
        <div>
            <Dropdown
                trigger="click"
                onVisibleChange={(...args) => {
                    console.log('onVisibleChange: ', ...args);
                }}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>1111</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item selected={true}>
                            2222 What if the text is super long? Longer than whatever you've known
                        </Dropdown.Item>
                        <Dropdown.Item>It looks OK</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Open dropdown</Button>
            </Dropdown>
        </div>
    );
});
stories.add('dropdown in table', () => <InTableDemo />);
stories.add('dropdown auto close when clicked', () => <AutoClose />);
stories.add('multi dropdown', () => <MultiDropdown />);
stories.add('dropdownItem type', () => (
    <>
        <Dropdown
            visible={true}
            trigger="custom"
            render={
                <Dropdown.Menu>
                    <Dropdown.Item type="primary">primary</Dropdown.Item>
                    <Dropdown.Item type="secondary">secondary</Dropdown.Item>
                    <Dropdown.Item type="tertiary">tertiary</Dropdown.Item>
                    <Dropdown.Item type="warning">warning</Dropdown.Item>
                    <Dropdown.Item type="danger">danger</Dropdown.Item>
                    <Dropdown.Item>default</Dropdown.Item>
                </Dropdown.Menu>
            }
        >
            Different type Item
        </Dropdown>
        <Dropdown
            visible={true}
            trigger="custom"
            showTick
            render={
                <Dropdown.Menu>
                    <Dropdown.Item type="primary" active>
                        primary
                    </Dropdown.Item>
                    <Dropdown.Item type="secondary">secondary</Dropdown.Item>
                    <Dropdown.Item type="tertiary">tertiary</Dropdown.Item>
                    <Dropdown.Item type="warning">warning</Dropdown.Item>
                    <Dropdown.Item type="danger" active>
                        编辑danger
                    </Dropdown.Item>
                    <Dropdown.Item>default</Dropdown.Item>
                </Dropdown.Menu>
            }
        >
            Different type Item
        </Dropdown>
    </>
));
stories.add('DisabledItem', () => <DisabledItem />);
stories.add(`in hover elements`, () => <InHoverElements />);
stories.add(`wrap avatar`, () => <WrapAvatar />);

function DropdownItemPropsDemo() {
    return (
        <div>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item icon={<IconBox />}>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item iconType="setting">Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled iconType="forward">
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item iconType="align_center" type="primary" iconType="branch">
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="color_palette" type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="refresh" type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="search" type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={
                                <IconSimilarity
                                    style={{
                                        color: 'var(--semi-color-tertiary)',
                                    }}
                                />
                            }
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>始终展示</Button>
            </Dropdown>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                showTick
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item active icon={<IconBox />}>
                            Menu Item 1
                        </Dropdown.Item>
                        <Dropdown.Item iconType="setting">Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled iconType="forward">
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item iconType="align_center" type="primary" iconType="branch">
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="color_palette" type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="refresh" type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item iconType="search" type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={
                                <IconSimilarity
                                    style={{
                                        color: 'var(--semi-color-tertiary)',
                                    }}
                                />
                            }
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button
                    style={{
                        marginLeft: 200,
                    }}
                >
                    始终展示
                </Button>
            </Dropdown>
        </div>
    );
}

stories.add(`Dropdown.Item props`, () => <DropdownItemPropsDemo />);
