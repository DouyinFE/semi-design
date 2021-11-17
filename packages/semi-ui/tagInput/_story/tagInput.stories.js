import React from 'react';
import { Toast, Icon, Button, Avatar } from '@douyinfe/semi-ui/';
import TagInput from '../index';
import { IconGift, IconVigoLogo } from '@douyinfe/semi-icons';
const style = {
  width: 400,
  marginTop: 10,
};

export default {
  title: 'TagInput'
}

export const Default = () => (
  <>
    <TagInput defaultValue={['抖音', '火山', '西瓜视频']} placeholder="请输入..." style={style} />
    <TagInput
      maxTagCount={2}
      showRestTagsPopover={true}
      restTagsPopoverProps={{ position: 'top' }}
      defaultValue={['抖音', '火山', '西瓜视频']}
      onChange={v => console.log(v)}
    />
  </>
);

Default.story = {
  name: 'default',
};

export const AutoFocus = () => (
  <TagInput
    defaultValue={['抖音', '火山', '西瓜视频']}
    autoFocus
    placeholder="请输入..."
    style={style}
  />
);

AutoFocus.story = {
  name: 'autoFocus',
};

export const Separator = () => (
  <>
    <TagInput placeholder="默认 separator" onChange={v => console.log(v)} />
    <br />
    <br />
    <TagInput separator="-" placeholder="使用 - 进行批量输入" onChange={v => console.log(v)} />
    <br />
    <br />
    <TagInput
      separator={[',', '|', '.']}
      placeholder="支持多个分隔符进行批量输入"
      onChange={v => console.log(v)}
    />
    <br />
    <br />
    <TagInput separator={null} placeholder="separator 为 null" onChange={v => console.log(v)} />
    <br />
    <br />
    <TagInput separator={1} placeholder="separator 为 number" onChange={v => console.log(v)} />
    <br />
    <br />
    <TagInput separator={' '} placeholder="separator 为 空格" onChange={v => console.log(v)} />
  </>
);

Separator.story = {
  name: 'separator',
};

export const ShowClear = () => (
  <TagInput defaultValue={['抖音', '火山', '西瓜视频']} showClear style={style} />
);

ShowClear.story = {
  name: 'showClear',
};

export const MaxExceed = () => (
  <>
    <TagInput
      style={style}
      max={3}
      placeholder="最多输入3条标签.."
      onExceed={() => {
        Toast.warning('不允许超过 max');
      }}
    />
    <br />
    <br />
    <TagInput
      style={style}
      maxLength={5}
      placeholder="单个标签长度不超过5..."
      onInputExceed={() => {
        Toast.warning('不允许超过 maxLength');
      }}
    />
  </>
);

MaxExceed.story = {
  name: 'max / exceed',
};

export const Size = () => (
  <>
    <TagInput
      style={style}
      size="small"
      showClear
      defaultValue={['抖音', '火山']}
      placeholder="请输入..."
    />
    <br />
    <br />
    <TagInput style={style} showClear defaultValue={['抖音', '火山']} placeholder="请输入..." />
    <br />
    <br />
    <TagInput
      style={style}
      size="large"
      showClear
      defaultValue={['抖音', '火山']}
      placeholder="请输入..."
    />
  </>
);

Size.story = {
  name: 'size',
};

export const ValidateStatus = () => (
  <>
    <TagInput style={style} />
    <br />
    <br />
    <TagInput style={style} validateStatus="default" />
    <br />
    <br />
    <TagInput style={style} validateStatus="warning" />
    <br />
    <br />
    <TagInput style={style} validateStatus="error" />
  </>
);

ValidateStatus.story = {
  name: 'validateStatus',
};

class ChangeDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ['controlTag'],
    };
  }

  onChange(value) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <TagInput
        style={style}
        value={this.state.value}
        onChange={value => {
          this.onChange(value);
        }}
      />
    );
  }
}

export const ValueOnChange = () => <ChangeDemo />;

ValueOnChange.story = {
  name: 'value / onChange',
};

class InputChangeDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 'controlInput',
    };
  }

  handleInputChange(value, event) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <TagInput
        style={style}
        inputValue={this.state.value}
        onInputChange={(v, e) => this.handleInputChange(v, e)}
      />
    );
  }
}

export const InputValueOnInputChange = () => <InputChangeDemo />;

InputValueOnInputChange.story = {
  name: 'inputValue / onInputChange',
};

export const OnXxx = () => (
  <>
    <TagInput
      style={style}
      defaultValue={['抖音', '火山', '西瓜视频']}
      placeholder="onFocus和onBlur"
      showClear
      onFocus={e => {
        console.log(`onFocus`);
      }}
      onBlur={e => {
        console.log(`onBlur`);
      }}
    />
    <br />
    <br />
    <TagInput
      style={style}
      defaultValue={['抖音', '火山', '西瓜视频']}
      placeholder="onChange"
      showClear
      onChange={tag => {
        console.log(`onChange,当前标签数组：${tag}`);
      }}
    />
    <br />
    <br />
    <TagInput
      style={style}
      defaultValue={['抖音', '火山', '西瓜视频']}
      placeholder="onAdd和onRemove"
      showClear
      onAdd={tag => {
        console.log(`onAdd，新增：${tag}`);
      }}
      onRemove={tag => {
        console.log(`onRemove，移除： ${tag}`);
      }}
    />
    <br />
    <br />
    <TagInput
      style={style}
      defaultValue={['抖音', '火山', '西瓜视频']}
      placeholder="onInputChange"
      showClear
      onInputChange={(input, e) => {
        console.log(`onInputChange，当前输入内容： ${input}`);
      }}
    />
  </>
);

OnXxx.story = {
  name: 'onXXX',
};

export const Disabled = () => (
  <TagInput
    style={style}
    disabled
    showClear
    defaultValue={['抖音', '火山', '西瓜视频']}
    placeholder="请输入..."
  />
);

Disabled.story = {
  name: 'disabled',
};

class MethodsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.handleTagInputFocus = this.handleTagInputFocus.bind(this);
  }

  handleTagInputFocus() {
    this.ref.current.focus();
  }

  render() {
    return (
      <>
        <TagInput style={style} defaultValue={['抖音', '火山']} ref={this.ref} />
        <br />
        <Button
          style={{
            marginTop: 10,
          }}
          onClick={this.handleTagInputFocus}
        >
          点击按钮聚焦
        </Button>
      </>
    );
  }
}

export const FocusBlur = () => <MethodsDemo />;

FocusBlur.story = {
  name: 'focus() / blur()',
};

class CustomRender extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [
        {
          name: 'semi',
          email: 'semi@byte.com',
          avatar:
            'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
        },
      ],
    };
  }

  renderTagItem(node, index) {
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          marginRight: 10,
        }}
      >
        <Avatar src={node.avatar} size="extra-small">
          {node.abbr}
        </Avatar>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {node.email}
        </span>
      </div>
    );
  }

  handleChange(value) {
    const list = value.map(v => {
      const item = {};
      item.name = v.name || v;
      item.email = `${item.name}@byte.com`;
      item.avatar = `https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg`;
      return item;
    });
    this.setState({
      list,
    });
  }

  render() {
    const { list } = this.state;
    return (
      <TagInput
        style={style}
        value={list}
        onChange={value => this.handleChange(value)}
        renderTagItem={(node, index) => this.renderTagItem(node, index)}
      />
    );
  }
}

export const RenderTagItem = () => <CustomRender />;

RenderTagItem.story = {
  name: 'renderTagItem',
};

export const PrefixSuffix = () => (
  <>
    <TagInput style={style} prefix={<IconVigoLogo />} showClear />
    <br />
    <br />
    <TagInput style={style} prefix="Prefix" showClear />
    <br />
    <br />
    <TagInput style={style} suffix={<IconGift />} />
    <br />
    <br />
    <TagInput style={style} suffix="Suffix" showClear />
  </>
);

PrefixSuffix.story = {
  name: 'prefix / suffix',
};
