import React, { useState, useCallback, useMemo } from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Button from '../../button';
import Popover from '../../popover';
import Checkbox from '../index';
import CheckboxGroup from '../checkboxGroup';
import { Input, Row, Col } from '../../index';
import { IconClose } from '@douyinfe/semi-icons';
const stories = storiesOf('Checkbox', module); // stories.addDecorator(withKnobs);;

stories.add('checkbox default', () => {
    return (
        <div>
            <Checkbox onChange={e => console.log(e)} value={1} onChange={v => console.log(v)}>
                hello
            </Checkbox>
            <br />
            <Checkbox checked>这是一个受控的checked=true的checkbox,没有配onChange</Checkbox>
            <br />
            <Checkbox defaultChecked>这是一个不受控的defaultChecked=true的checkbox</Checkbox>
            <br />
            <Checkbox disabled>这是一个受控的disabled=true的checkbox</Checkbox>
            <br />
            <Checkbox checked disabled>
                既checked又disabled
            </Checkbox>
            <br />
            <Checkbox indeterminate>indeterminate</Checkbox>
        </div>
    );
});
stories.add('checkbox without text', () => {
    return (
        <div>
            <Checkbox onChange={e => console.log(e)} />
        </div>
    );
});

class CheckboxControl extends React.Component {
    state = {
        checked: true,
        disabled: false,
    };
    toggleChecked = () => {
        this.setState({
            checked: !this.state.checked,
        });
    };
    toggleDisable = () => {
        this.setState({
            disabled: !this.state.disabled,
        });
    };
    onChange = e => {
        console.log('checked = ', e.target.checked);
        this.setState({
            checked: e.target.checked,
        });
    };

    render() {
        const label = `${this.state.checked ? 'Checked' : 'Unchecked'}-${this.state.disabled ? 'Disabled' : 'Enabled'}`;
        return (
            <div>
                <p
                    style={{
                        marginBottom: '20px',
                    }}
                >
                    <Checkbox checked={this.state.checked} disabled={this.state.disabled} onChange={this.onChange}>
                        {label}
                    </Checkbox>
                </p>
                <p>
                    <Button type="primary" size="small" onClick={this.toggleChecked}>
                        {!this.state.checked ? 'Check' : 'Uncheck'}
                    </Button>
                    <Button
                        style={{
                            marginLeft: '10px',
                        }}
                        type="primary"
                        size="small"
                        onClick={this.toggleDisable}
                    >
                        {!this.state.disabled ? 'Disable' : 'Enable'}
                    </Button>
                </p>
            </div>
        );
    }
}

stories.add('checkbox controlled disabled & checked', () => <CheckboxControl />);

class GroupDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: [],
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        console.log(value);
        this.setState({
            value: value,
        });
    }

    render() {
        let { value } = this.state;
        return (
            <>
                水平Group
                <Checkbox.Group direction="horizontal" onChange={v => console.log(v)}>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
                <br />
                <br />
                垂直Group
                <Checkbox.Group onChange={v => console.log(v)}>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
                <br />
                <br />
                默认Group
                <Checkbox.Group direction="horizontal" defaultValue={['xigua']} onChange={console.log}>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
                <br />
                <br />
                受控Group
                <Checkbox.Group direction="horizontal" value={value} onChange={console.log}>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
                <br />
                <br />
                受控Group+onChange
                <Checkbox.Group direction="horizontal" value={value} onChange={this.onChange}>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
                <br />
                <br />
                disabled
                <Checkbox.Group disabled>
                    <Checkbox value="tiktok">抖音</Checkbox>
                    <Checkbox value="hotsoon">火山</Checkbox>
                    <Checkbox value="toutiao">今日头条</Checkbox>
                    <Checkbox value="xigua">西瓜视频</Checkbox>
                </Checkbox.Group>
            </>
        );
    }
}

stories.add('checkbox group', () => <GroupDemo />);
stories.add('checkbox group with options ', () => {
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const options = [
        {
            label: 'Apple',
            value: 'Apple',
        },
        {
            label: 'Pear',
            value: 'Pear',
        },
        {
            label: 'Orange',
            value: 'Orange',
            disabled: true,
        },
    ];
    const optionsWithDisabled = [
        {
            label: 'Apple',
            value: 'Apple',
        },
        {
            label: 'Pear',
            value: 'Pear',
        },
        {
            label: 'Orange',
            value: 'Orange',
            disabled: false,
        },
    ];
    return (
        <div>
            default
            <CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
            <br />
            <br />
            受控
            <CheckboxGroup options={plainOptions} value={['Apple']} onChange={onChange} />
            <br />
            最后一个disabled
            <br />
            <CheckboxGroup options={options} defaultValue={['Pear']} onChange={onChange} />
            <br />
            全体disabled， 优先父级disabled，次选子级disabled
            <br />
            <CheckboxGroup options={optionsWithDisabled} disabled defaultValue={['Apple']} onChange={onChange} />
        </div>
    );
});
stories.add('checkboxGroup-直接后代是其他类型Node', () => {
    return (
        <CheckboxGroup>
            <div className="test">
                <Checkbox value="Apple" extra="苹果">
                    Apple
                </Checkbox>
                <Checkbox value="Pear" extra="梨">
                    Pear
                </Checkbox>
                <Checkbox value="Orange" extra="橙子">
                    Orange
                </Checkbox>
            </div>
        </CheckboxGroup>
    );
});
stories.add('checkbox 主文本+副文本', () => {
    let options = [
        {
            label: 'Apple',
            value: 'Apple',
            extra: '苹果',
        },
        {
            label: 'Pear',
            value: 'Pear',
            extra: '梨',
        },
        {
            label: 'Orange',
            value: 'Orange',
            disabled: true,
            extra: '橙子',
        },
    ];
    return (
        <div>
            checkbox
            <Checkbox
                onChange={e => console.log(e)}
                extra="我是副文本，这是辅助的文本，辅助文本会更长一些，甚至还可能换行"
            >
                我是主文本
            </Checkbox>
            <Checkbox
                style={{
                    width: 200,
                }}
                onChange={e => console.log(e)}
                extra="我是副文本，这是辅助的文本，辅助文本会更长一些，甚至还可能换行"
            >
                我是主文本
            </Checkbox>
            <br />
            <br />
            checkboxGroup
            <CheckboxGroup>
                <Checkbox value="Apple" extra="苹果">
                    Apple
                </Checkbox>
                <Checkbox value="Pear" extra="梨">
                    Pear
                </Checkbox>
                <Checkbox value="Orange" extra="橙子">
                    Orange
                </Checkbox>
            </CheckboxGroup>
            <br />
            <br />
            checkboxGroup with options
            <CheckboxGroup options={options}></CheckboxGroup>
        </div>
    );
});
stories.add('checkbox + grid', () => {
    return (
        <Checkbox.Group
            style={{
                width: '100%',
            }}
            onChange={v => console.log(v)}
        >
            <Row>
                <Col span={8}>
                    <Checkbox value="A">
                        无限长的一串字The Storybook webapp UI can be customised with this addon. It can be used to
                        change the header, show/hide various UI elements and to enable full-screen mode by default.
                    </Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox value="B">B</Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox value="C">C</Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox value="D">D</Checkbox>
                </Col>
                <Col span={8}>
                    <Checkbox value="E">E</Checkbox>
                </Col>
            </Row>
        </Checkbox.Group>
    );
});
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

class IndeterminateDemo extends React.Component {
    state = {
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false,
    };
    onChange = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };
    onCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    render() {
        return (
            <div>
                <div
                    style={{
                        borderBottom: '1px solid #E9E9E9',
                    }}
                >
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        Check all
                    </Checkbox>
                </div>
                <br />
                <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </div>
        );
    }
}

stories.add('checkbox inderterminate联动', () => <IndeterminateDemo />);
stories.add('checkbox render in div', () => (
    <>
        <div
            onClick={(...args) => {
                console.log('clicked checkbox outer: ', ...args);
            }}
        >
            <Checkbox
                onChange={(...args) => {
                    console.log('clicked checkbox: ', ...args);
                }}
            />
        </div>
    </>
));
stories.add(`checkbox in popover`, () => (
    <div>
        <Popover
            content={
                <div>
                    <Checkbox>选项一</Checkbox>
                    <Checkbox defaultChecked>选项二</Checkbox>
                    <Checkbox>选项三</Checkbox>
                </div>
            }
        >
            <Button>click me</Button>
        </Popover>
    </div>
));

const SwitchCheckedFromTrue2Undefined = () => {
    const [props, setProps] = useState();
    const [flag, setFlag] = useState(0);

    const change = () => {
        if (flag === 0) {
            setFlag(1);
            setProps({ checked: true });
        } else {
            setFlag(0);
            setProps({ checked: false });
        }
    };

    return <>
        <Checkbox {...props} >123</Checkbox>
        <Button onClick={() => change()}>switch</Button>
    </>
};

stories.add('checkbox switch checked: true => undefined', () => <SwitchCheckedFromTrue2Undefined />);

const TransformSelect = props => {
    const { onChange, value, options = [], defaultValue = [], placeholder } = props;
    const [currentValue, setCurrentValue] = useState([]);
    const [inputValue, setInputValue] = useState(''); // 变化

    const onSelectChange = useCallback(() => {
        setCurrentValue(currentValue);
        onChange && onChange(currentValue);
    }, []); // 选择某一个

    const removeValue = useCallback(
        currentIndex => {
            currentValue.splice(currentIndex, 1);
            onSelectChange([...currentValue]);
        },
        [currentValue]
    ); // 选择所有

    const selectAllValue = useCallback(() => {
        const value = options.map(option => option.value);
        onSelectChange(value);
    }, [options]);
    const viewsOptions = useMemo(() => {
        if (inputValue) {
            const newOptions = options.filter(option => option.label.indexOf(inputValue) !== -1);
            return newOptions;
        }

        return options;
    }, [options, inputValue]);
    return (
        <div>
            <div>
                <div>
                    <Input
                        value={inputValue}
                        prefix="search"
                        clearable
                        onChange={value => setInputValue(value)}
                        placeholder={placeholder}
                    />
                </div>
                <div>
                    <span>{`共 ${options.length} 项`}</span>
                    <Button type="tertiary" size="small" theme="borderless" onClick={() => selectAllValue()}>
                        全选
                    </Button>
                </div>
                <div>
                    <CheckboxGroup
                        options={viewsOptions}
                        value={currentValue}
                        onChange={onSelectChange}
                        direction="vertical"
                    />
                </div>
            </div>
            <div>
                <div>
                    <span>{`已选 ${currentValue.length} 项`}</span>
                    <Button type="tertiary" size="small" theme="borderless" onClick={() => onSelectChange([])}>
                        清空
                    </Button>
                </div>
                <div>
                    {currentValue.length > 0 ? (
                        currentValue.map((value, idx) => {
                            // 不存在不需要展示
                            const option = options.find(option => option.value === value);
                            return (
                                <div key={option.key ? option.key : idx}>
                                    <span>{option.label}</span>
                                    <span onClick={() => removeValue(idx)}>
                                        <IconClose size="small" />
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div>暂无内容，可从左侧勾选</div>
                    )}
                </div>
            </div>
        </div>
    );
};

stories.add(`bugDemo`, () => <TransformSelect />);

stories.add(`checkboxGroup card style`, () => (
    <>
        <div>常见情况</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>radio disabled</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' disabled extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>checkboxGroup disabled</div>
        <CheckboxGroup type='card' direction='horizontal' disabled defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>文字很长，并且没有设置宽度，因此换行显示</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>设置了width=180</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有extra，width=180</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有标题，width=380</div>
        <CheckboxGroup type='card' direction='horizontal' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <hr />
        <div>下面是垂直的情况：</div>
        <div>常见情况</div>
        <CheckboxGroup direction='vertical' type='card' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有设置宽度</div>
        <CheckboxGroup direction='vertical' type='card' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>设置了width=380</div>
        <CheckboxGroup direction='vertical' type='card' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
    </>
));

stories.add(`checkboxGroup pureCard style`, () => (
    <>
        <div>常见情况</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>radio disabled</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' disabled extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>checkboxGroup disabled</div>
        <CheckboxGroup type='pureCard' disabled defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>文字很长，并且没有设置宽度，因此换行显示</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>设置了width=180</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有extra，width=180</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' style={{ width: 180 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有标题，width=380</div>
        <CheckboxGroup type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <hr />
        <div>下面是垂直的情况：</div>
        <div>常见情况</div>
        <CheckboxGroup direction='vertical' type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design' style={{ width: 280 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>没有设置宽度</div>
        <CheckboxGroup direction='vertical' type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
        <br />
        <br />
        <div>设置了width=380</div>
        <CheckboxGroup direction='vertical' type='pureCard' defaultValue={['1']}>
            <Checkbox value='1' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='2' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
            <Checkbox value='3' extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 380 }}>
                多选框标题
            </Checkbox>
        </CheckboxGroup>
    </>
));