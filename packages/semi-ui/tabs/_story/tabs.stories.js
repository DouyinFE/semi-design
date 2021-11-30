import React, { useState } from 'react';
import Tabs from '../index';
import Button from '@douyinfe/semi-ui/button/index';
import Typography from '@douyinfe/semi-ui/typography/index';
import Switch from '@douyinfe/semi-ui/switch/index';
import { Radio, RadioGroup } from '@douyinfe/semi-ui';
import Icon from '../../icons';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';
const TabPane = Tabs.TabPane;
const { Title } = Typography;

export default {
  title: 'Tabs'
}

const style = {
  width: '600px',
  margin: '20px',
};

const onChange = activeKey => {
  console.log('onChange: activeKey =>', activeKey);
};

const onTabClick = (activeKey, event) => {
  console.log('onTabClick: onTabClick =>', activeKey);
};

const operations = (
  <Button
    onClick={() => {
      alert('you have clicked me!');
    }}
  >
    Extra Action
  </Button>
);

class App extends React.Component {
  render() {
    return (
      <div>
        <Tabs type="line">
          <TabPane tab="文档" itemKey="1">
            <h3>文档</h3>
            <p
              style={{
                lineHeight: 1.8,
              }}
            >
              Semi Design 是由互娱社区前端团队与 UED
              团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
              Web 应用。
            </p>
            <p
              style={{
                lineHeight: 1.8,
              }}
            >
              区别于其他的设计系统而言，Semi Design
              以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
            </p>
            <ul>
              <li>
                <p>Semi Design 以内容优先进行设计。</p>
              </li>
              <li>
                <p>更容易地自定义主题。</p>
              </li>
              <li>
                <p>适用国际化场景。</p>
              </li>
              <li>
                <p>效率场景加入人性化关怀。</p>
              </li>
            </ul>
            <h3>文档</h3>
            <p
              style={{
                lineHeight: 1.8,
              }}
            >
              Semi Design 是由互娱社区前端团队与 UED
              团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
              Web 应用。
            </p>
            <p
              style={{
                lineHeight: 1.8,
              }}
            >
              区别于其他的设计系统而言，Semi Design
              以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
            </p>
            <ul>
              <li>
                <p>Semi Design 以内容优先进行设计。</p>
              </li>
              <li>
                <p>更容易地自定义主题。</p>
              </li>
              <li>
                <p>适用国际化场景。</p>
              </li>
              <li>
                <p>效率场景加入人性化关怀。</p>
              </li>
            </ul>
          </TabPane>
          <TabPane tab="快速起步" itemKey="2">
            <h3>快速起步</h3>
            <p
              style={{
                lineHeight: 1.8,
              }}
            >
              如果是全新的项目，建议你使用 eden 初始化项目，初始化项目类型选择 react
            </p>
            <pre
              style={{
                margin: '24px 0',
                padding: '20px',
                border: 'none',
                whiteSpace: 'normal',
                borderRadius: '6px',
                color: 'var(--semi-color-text-1)',
                backgroundColor: 'var(--semi-color-fill-0)',
              }}
            >
              <code></code>
            </pre>
          </TabPane>
          <TabPane tab="帮助" itemKey="3">
            <h3>帮助</h3>
            <p
              style={{
                lineHeight: 1.8,
                color: 'var(--semi-color-text-0)',
                fontWeight: 600,
              }}
            >
              Q：有新组件需求、或者现有组件feature不能满足业务需求？
            </p>
            <p
              style={{
                lineHeight: 1.8,
                color: 'var(--semi-color-text-1)',
              }}
            >
              右上角问题反馈，提交issue，label选择Feature Request / New Component Request
              我们会高优处理这些需求。
            </p>
            <p
              style={{
                lineHeight: 1.8,
                color: 'var(--semi-color-text-0)',
                fontWeight: 600,
              }}
            >
              Q：对组件的使用有疑惑？
            </p>
            <p
              style={{
                lineHeight: 1.8,
                color: 'var(--semi-color-text-1)',
              }}
            >
              欢迎进我们的客服lark群进行咨询提问。
            </p>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export const Level1NoIcon = () => (
  <div
    style={{
      width: 500,
      height: 500,
      margin: 50,
    }}
  >
    <App />
  </div>
);

Level1NoIcon.story = {
  name: 'Level 1-无图标',
};

export const DefaultActiveKeyDemo = () => (
  <Tabs style={style} defaultActiveKey="3" onChange={onChange} onTabClick={onTabClick}>
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

DefaultActiveKeyDemo.story = {
  name: '指定defaultActiveKey',
};

export const Level1WithIcon = () => (
  <Tabs style={style} defaultActiveKey="1" onChange={onChange} onTabClick={onTabClick}>
    <TabPane
      tab={
        <span>
          <IconFile />
          文档
        </span>
      }
      itemKey="1"
    >
      文档
    </TabPane>
    <TabPane
      tab={
        <span>
          <IconGlobe />
          快速起步
        </span>
      }
      itemKey="2"
    >
      快速起步
    </TabPane>
    <TabPane
      tab={
        <span>
          <IconHelpCircle />
          帮助
        </span>
      }
      itemKey="3"
    >
      帮助
    </TabPane>
  </Tabs>
);

Level1WithIcon.story = {
  name: 'Level 1-有图标',
};

export const Level1WithTabBarExtraContent = () => (
  <Tabs style={style} defaultActiveKey="1" tabBarExtraContent={operations}>
    <TabPane tab="文档" itemKey="1">
      文档
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

Level1WithTabBarExtraContent.story = {
  name: 'Level 1-导航内容扩展',
};

export const RenderTabBar = () => (
  <Tabs
    style={style}
    defaultActiveKey="1"
    renderTabBar={(tabBarProps, DefaultTabBar) => {
      return (
        <div className="tab-bar-box" itemKey="bar">
          这是二次封装的Tab Bar，当前ActiveKey：{tabBarProps.activeKey}
          <DefaultTabBar {...tabBarProps} />
        </div>
      );
    }}
  >
    <TabPane tab="文档" itemKey="1">
      文档
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

RenderTabBar.story = {
  name: 'Level 1-导航二次封装',
};

export const DisabledTab = () => (
  <Tabs style={style} defaultActiveKey="1">
    <TabPane tab="文档" itemKey="1">
      文档
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3" disabled>
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4" disabled>
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

DisabledTab.story = {
  name: 'Level 1-不可点击Tab',
};

export const Level2Card = () => (
  <Tabs style={style} defaultActiveKey="1" type="card">
    <TabPane tab="文档" itemKey="1">
      文档
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

Level2Card.story = {
  name: 'Level 2-卡片Tab',
};

export const Level3ButtonTab = () => (
  <Tabs style={style} defaultActiveKey="1" type="button">
    <TabPane tab="文档" itemKey="1">
      文档
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

Level3ButtonTab.story = {
  name: 'Level 3-按钮Tab',
};

class TabDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      itemKey: '1',
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(itemKey, type) {
    this.setState({
      [type]: itemKey,
    });
  }

  render() {
    const contentList = [
      <div>文档</div>,
      <div>快速起步</div>,
      <div>帮助</div>,
      <div>关于</div>,
      <div>资源工具</div>,
    ];
    const tabList = [
      {
        tab: '文档',
        itemKey: '1',
      },
      {
        tab: '快速起步',
        itemKey: '2',
      },
      {
        tab: '帮助',
        itemKey: '3',
      },
      {
        tab: '关于',
        itemKey: '4',
      },
      {
        tab: '资源工具',
        itemKey: '5',
      },
    ];
    return (
      <Tabs
        style={style}
        type="line"
        tabList={tabList}
        onTabClick={itemKey => {
          this.onTabClick(itemKey, 'itemKey');
        }}
      >
        {contentList[this.state.itemKey]}
        <span>test</span>
        <span>test2</span>
      </Tabs>
    );
  }
}

export const TabList = () => <TabDemo />;

TabList.story = {
  name: 'tabList',
};

class TabDemo2 extends React.Component {
  constructor() {
    super();
    this.state = {
      key: '1',
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(val) {
    console.log('key', val);
    this.setState({
      key: val,
    });
  }

  render() {
    return (
      <Tabs type="line" activeKey={this.state.key} onChange={val => this.onTabClick(val)}>
        <TabPane tab="文档" itemKey="1">
          文档
        </TabPane>
        <TabPane tab="快速起步" itemKey="2">
          快速起步
        </TabPane>
        <TabPane tab="帮助" itemKey="3">
          帮助
        </TabPane>
        <TabPane tab="关于" itemKey="4">
          关于
        </TabPane>
        <TabPane tab="资源工具" itemKey="5">
          资源工具
        </TabPane>
      </Tabs>
    );
  }
}

export const ActiveKey = () => <TabDemo2 />;

ActiveKey.story = {
  name: 'activeKey',
};

class TabDemo3 extends React.Component {
  constructor() {
    super();
    this.state = {
      key: '1',
      type: 'here',
    };
  }

  onTabClick(val) {
    console.log('key', val);
    this.setState({
      key: val,
      type: 'search',
    });
  }

  render() {
    let type = this.state.type;
    return (
      <Tabs type="line" activeKey={this.state.key} onChange={val => this.onTabClick(val)}>
        <TabPane tab="文档" itemKey="1">
          文档
        </TabPane>
        <TabPane tab="快速起步" itemKey="2">
          快速起步
        </TabPane>
        {type === 'search' && (
          <TabPane tab="搜索" itemKey="3">
            搜索
          </TabPane>
        )}
      </Tabs>
    );
  }
}

export const Dynamic = () => <TabDemo3 />;

class TabDemo4 extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  updateTab = () => {
    this.setState({
      loading: !this.state.loading,
    });
    this.tab = Math.random();
  };

  render() {
    let type = this.state.type;
    return (
      <div>
        <Button onClick={() => this.updateTab()}>change</Button>
        <Tabs type="line">
          <TabPane tab={this.tab} itemKey="1">
            文档
          </TabPane>
          <TabPane tab="快速起步" itemKey="2">
            快速起步
          </TabPane>
          {type === 'search' && (
            <TabPane tab="搜索" itemKey="3">
              搜索
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

export const Update = () => <TabDemo4 />;

export const RenderCurrentPane = () => (
  <Tabs style={style} keepDOM={false}>
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

RenderCurrentPane.story = {
  name: '只渲染当前pane'
}

export const LazyRender = () => (
  <Tabs style={style} lazyRender>
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);
LazyRender.story = {
  name: '懒渲染'
}

export const VerticalTabs = () => (
  <Tabs style={style} tabPosition="left">
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);
VerticalTabs.story = {
  name: '垂直的tabs'
}

export const HorizontalTabs = () => (
  <Tabs style={style} tabPosition="left" type="card">
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

HorizontalTabs.story = {
  name: '垂直的tabs - 卡片',
};

export const VerticalTabsButton = () => (
  <Tabs style={style} tabPosition="left" type="button">
    <TabPane tab="文档" itemKey="1">
      <span>文档</span>
    </TabPane>
    <TabPane tab="快速起步" itemKey="2">
      快速起步
    </TabPane>
    <TabPane tab="帮助" itemKey="3">
      帮助
    </TabPane>
    <TabPane tab="关于" itemKey="4">
      关于
    </TabPane>
    <TabPane tab="资源工具" itemKey="5">
      资源工具
    </TabPane>
  </Tabs>
);

VerticalTabsButton.story = {
  name: '垂直的tabs - 按钮',
};

export const CollapseTabs = () => (
  <div>
    <Tabs
      style={{
        width: '60%',
        margin: '20px',
      }}
      type="card"
      collapsible
    >
      {[...Array(30).keys()].map(i => (
        <TabPane tab={`Tab-${i}`} itemKey={`Tab-${i}`}>
          Content of card tab {i}
        </TabPane>
      ))}
    </Tabs>
    <br />
    <br />
    <Tabs style={style} type="button" collapsible>
      {[...Array(30).keys()].map(i => (
        <TabPane tab={`Tab-${i}`} itemKey={`${i}`}>
          Content of button tab {i}
        </TabPane>
      ))}
    </Tabs>
    <br />
    <br />
    <Tabs style={style} type="line" collapsible>
      {[...Array(30).keys()].map(i => (
        <TabPane tab={`Tab-${i}`} itemKey={`${i}`}>
          Content of line tab {i}
        </TabPane>
      ))}
    </Tabs>
  </div>
);
CollapseTabs.story = {
  name: '折叠的tabs'
}

const TabSizeDemo = () => {
  const typeList = ['line'];
  const [size, setSize] = useState('large');
  const [vertical, setVertical] = useState(false);
  return (
    <div>
      <RadioGroup onChange={e => setSize(e.target.value)} value={size}>
        <Radio value={'small'}>small</Radio>
        <Radio value={'medium'}>medium</Radio>
        <Radio value={'large'}>large</Radio>
      </RadioGroup>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Title
          heading={6}
          style={{
            margin: 8,
          }}
        >
          {vertical ? '垂直' : '水平'}
        </Title>
        <Switch checked={vertical} onChange={setVertical} />
      </div>
      {typeList.map((type, index) => {
        return (
          <Tabs
            style={{
              width: '60%',
              margin: '20px',
            }}
            type={type}
            size={size}
            key={index}
            tabPosition={vertical ? 'left' : 'top'}
          >
            {[...Array(3).keys()].map(i => (
              <TabPane tab={`Tab-${i}`} itemKey={`Tab-${i}`}>
                Content of {type} tab {i}
              </TabPane>
            ))}
          </Tabs>
        );
      })}
      <br />
      <br />
    </div>
  );
};

export const TabSize = () => <TabSizeDemo />;

TabSize.story = {
  name: 'tab size',
};
