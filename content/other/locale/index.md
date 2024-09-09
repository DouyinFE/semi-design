---
localeCode: zh-CN
order: 83
category: 其他
title:  LocaleProvider 多语言
icon: doc-i18n
dir: column
brief: 国际化组件，为 Semi 组件提供多语言支持
---


## 目前支持语言

| 最低支持版本  | 语言 |
| ----------- | ----------- |
| v0.0.1      | 简体中文: zh_CN |
| v0.7.0      | 英语: en_GB、日语: ja_JP、韩语: ko_KR      |
| v1.8.0      | 阿拉伯语: ar      |
| v1.11.0     | 越南语: vi_VN、俄罗斯语: ru_RU、印尼语: id_ID、马来语: ms_MY、泰语: th_TH、土耳其语: tr_TR |
| v1.17.0     | 葡萄牙语（巴西）: pt_BR       |
| v1.28.0     | 繁体中文: zh_TW       |
| v2.2.0     | 西班牙语: es       |
| v2.15.0     | 意大利语: it、法语：fr、德语：de   |
| v2.21.0     | 罗马尼亚语: ro   |
| v2.29.0     | 瑞典语: sv_SE、波兰语: pl_PL 、荷兰语: nl_NL |
## 已支持组件

> DatePicker、TimePicker、Modal、Pagination、Select、Table、Cascader、Calendar、TreeSelect、List、Typography、Transfer、Nav、Upload、Form、Navigation、Image

## 使用

LocaleProvider 使用了 React 的 context 上下文特性，你只需要在应用外围包裹一次即可全局生效  
当需要切换语言时，直接切换 props 传入的 locale 即可

```jsx hideInDSM
import React from 'react';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import ko_KR from '@douyinfe/semi-ui/lib/es/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';
import vi_VN from '@douyinfe/semi-ui/lib/es/locale/source/vi_VN';
import ru_RU from '@douyinfe/semi-ui/lib/es/locale/source/ru_RU';
import id_ID from '@douyinfe/semi-ui/lib/es/locale/source/id_ID';
import ms_MY from '@douyinfe/semi-ui/lib/es/locale/source/ms_MY';
import th_TH from '@douyinfe/semi-ui/lib/es/locale/source/th_TH';
import tr_TR from '@douyinfe/semi-ui/lib/es/locale/source/tr_TR';
import pt_BR from '@douyinfe/semi-ui/lib/es/locale/source/pt_BR';
import zh_TW from '@douyinfe/semi-ui/lib/es/locale/source/zh_TW';
import sv_SE from '@douyinfe/semi-ui/lib/es/locale/source/sv_SE';
import pl_PL from '@douyinfe/semi-ui/lib/es/locale/source/pl_PL';
import nl_NL from '@douyinfe/semi-ui/lib/es/locale/source/nl_NL';
import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';
import es from '@douyinfe/semi-ui/lib/es/locale/source/es';
import it from '@douyinfe/semi-ui/lib/es/locale/source/it';
import de from '@douyinfe/semi-ui/lib/es/locale/source/de';
import fr from '@douyinfe/semi-ui/lib/es/locale/source/fr';
import ro from '@douyinfe/semi-ui/lib/es/locale/source/ro';

import { LocaleProvider } from '@douyinfe/semi-ui';

// 在locale中传入相应的语言包即可
() => {
    return (
        <LocaleProvider locale={en_GB}>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <App />
        </LocaleProvider>
    );
};
```

## 代码示例

### 国际化

```jsx live=true dir="column" hideInDSM
import React from 'react';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';
import { LocaleProvider, Pagination } from '@douyinfe/semi-ui';

class I18nDemo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <LocaleProvider locale={en_GB}>
                    <Pagination total={100} showTotal showSizeChanger style={{ margin: 20 }} />
                </LocaleProvider>
                <LocaleProvider locale={ja_JP}>
                    <Pagination total={100} showTotal showSizeChanger style={{ margin: 20 }} />
                </LocaleProvider>
            </>
        );
    }
}
```

### 自定义国际化组件

当你的自定义组件，也希望消费 Semi LocaleProvider Context 中的 localeCode 或者读取具体某个组件的 i18n 文本 localeData时，你可以使用 LocaleConsumer 进行获取；

```jsx live=true dir="column" noInline=true
import React from 'react';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import ko_KR from '@douyinfe/semi-ui/lib/es/locale/source/ko_KR';
import { LocaleProvider, LocaleConsumer } from '@douyinfe/semi-ui';


class GetLocaleFromSemi extends React.Component {
    render() {
        return <LocaleConsumer componentName="TimePicker">
            {
                (localeData, localeCode, dateFnsLocale) => (
                    <div>{localeCode} : {localeData.begin}</div>
                )
            }
        </LocaleConsumer>;
    }
}

class ExtractComponent extends React.Component {
    render() {
        return <LocaleConsumer componentName="ComponentA">
            {
                (localeData, localeCode, dateFnsLocale) => (
                    <div>{localeData.customKey}</div>
                )
            }
        </LocaleConsumer>;
    }
}


class I18nCustomDemo extends React.Component {
    render() {
        const new_zh_CN = { ...zh_CN, ComponentA: { customKey: 'semi' } };
        const new_ko_KR = { ...ko_KR, ComponentA: { customKey: 'design' } };
        const new_en_GB = { ...en_GB, ComponentA: { customKey: 'dsm' } };

        return (
            <>
                <LocaleProvider locale={new_zh_CN}>
                    <GetLocaleFromSemi />
                </LocaleProvider>
                <LocaleProvider locale={new_ko_KR}>
                    <GetLocaleFromSemi />
                </LocaleProvider>
                <LocaleProvider locale={new_en_GB}>
                    <GetLocaleFromSemi />
                </LocaleProvider>
                <LocaleProvider locale={new_zh_CN}>
                    <ExtractComponent />
                </LocaleProvider>
                <LocaleProvider locale={new_ko_KR}>
                    <ExtractComponent />
                </LocaleProvider>
                <LocaleProvider locale={new_en_GB}>
                    <ExtractComponent />
                </LocaleProvider>
            </>
        );
    }
}

render(I18nCustomDemo);
```

### 支持多语言的组件

示例给出了目前所有支持多语言的组件

当你的网站有RTL适配需求时，推荐直接使用ConfigProvider，除了可配置locale外，还可以直接同时配置direction='rtl'/'ltr'  
若无RTL适配需求，直接使用LocaleProvider即可

```jsx live=true dir="column" hideInDSM
import React from 'react';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import ko_KR from '@douyinfe/semi-ui/lib/es/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';
import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';
import vi_VN from '@douyinfe/semi-ui/lib/es/locale/source/vi_VN';
import ru_RU from '@douyinfe/semi-ui/lib/es/locale/source/ru_RU';
import id_ID from '@douyinfe/semi-ui/lib/es/locale/source/id_ID';
import ms_MY from '@douyinfe/semi-ui/lib/es/locale/source/ms_MY';
import th_TH from '@douyinfe/semi-ui/lib/es/locale/source/th_TH';
import tr_TR from '@douyinfe/semi-ui/lib/es/locale/source/tr_TR';
import pt_BR from '@douyinfe/semi-ui/lib/es/locale/source/pt_BR';
import zh_TW from '@douyinfe/semi-ui/lib/es/locale/source/zh_TW';
import sv_SE from '@douyinfe/semi-ui/lib/es/locale/source/sv_SE';
import pl_PL from '@douyinfe/semi-ui/lib/es/locale/source/pl_PL';
import nl_NL from '@douyinfe/semi-ui/lib/es/locale/source/nl_NL';
import es from '@douyinfe/semi-ui/lib/es/locale/source/es';
import it from '@douyinfe/semi-ui/lib/es/locale/source/it';
import de from '@douyinfe/semi-ui/lib/es/locale/source/de';
import fr from '@douyinfe/semi-ui/lib/es/locale/source/fr';
import ro from '@douyinfe/semi-ui/lib/es/locale/source/ro';
import { LocaleProvider, ConfigProvider, Pagination, Modal, Button, Select, Cascader, DatePicker, TreeSelect, Table, TimePicker, List, Calendar, Typography, Transfer, ImagePreview, Image, Form, Nav } from '@douyinfe/semi-ui';
import { IconUser, IconSemiLogo, IconStar } from '@douyinfe/semi-icons';

class I18nDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: zh_CN,
            localeCode: 'zh_CN',
        };
        this.onLanguageChange = this.onLanguageChange.bind(this);
    }

    onLanguageChange(code) {
        let language = {
            'zh_CN': zh_CN,
            'en_GB': en_GB,
            'en_US': en_US,
            'ko_KR': ko_KR,
            'ja_JP': ja_JP,
            'ar': ar,
            'vi_VN': vi_VN,
            'ru_RU': ru_RU,
            'id_ID': id_ID,
            'ms_MY': ms_MY,
            'th_TH': th_TH,
            'tr_TR': tr_TR,
            'pt_BR': pt_BR,
            'zh_TW': zh_TW,
            'es': es,
            'sv_SE': sv_SE,
            'pl_PL': pl_PL,
            'nl_NL': nl_NL,
            de,
            it,
            fr,
            ro
        };
        this.setState({ locale: language[code], localeCode: code });
    }

    render() {
        const { locale, localeCode } = this.state;
        const treeData = [
            {
                label: 'Asia',
                value: 'asia',
                key: '1',
                children: [
                    {
                        label: 'China',
                        value: 'china',
                        key: '1-0',
                        children: [
                            { label: 'Beijing', value: 'beijing', key: '1-0-0' },
                            { label: 'Shanghai', value: 'shanghai', key: '1-0-1' },
                        ],
                    },
                    {
                        label: 'Japan',
                        value: 'japan',
                        key: '1-1',
                        children: [ { label: 'Osaka', value: 'osaka', key: '1-1-0' } ]
                    },
                ]
            }
        ];
        const I18nComponent = () => {
            const [modalVisible, setModalVisible] = useState(false);
            const columns = useMemo(() => [
                {
                    title: 'Name',
                    width: 250,
                    dataIndex: 'name',
                },
                {
                    title: 'Age',
                    width: 150,
                    dataIndex: 'age',
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                },
            ]);
            const dataSource = useMemo(() => {
                const data = [];
                for (let i = 0; i < 46; i++) {
                    data.push({
                        key: '' + i,
                        name: `Bytedance ${i}`,
                        age: 32,
                        address: `Beijing, Haidian. Zhichun Road ${i}`,
                    });
                }
                return data;
            });
            const transferData = useMemo(() => {
                return Array.from({ length: 100 }, (v, i) => {
                    return {
                        label: `选项名称 ${i}`,
                        value: i,
                        disabled: false,
                        key: i,
                    };
                });
            });
            const srcList = useMemo(() => ([
                "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg",
                "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/sky.jpg",
                "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/greenleaf.jpg",
                "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg",
            ]), []);
            const style = { margin: 10 };
            return (
                <>
                    <h5>Pagination</h5>
                    <Pagination total={100} showTotal showSizeChanger style={style} showQuickJumper />
                    <h5>Modal</h5>

                    <div style={style}>
                        <Button onClick={() => setModalVisible(true)}>
                            Show Modal
                        </Button>
                        <Modal
                            title="Modal"
                            visible={modalVisible}
                            onOk={() => setModalVisible(false)}
                            onCancel={() => setModalVisible(false)}
                        >
                            <p>This is the content of a basic modal.</p>
                            <p>More content...</p>
                        </Modal>
                    </div>
                    <h5>Select & Cascader</h5>
                    <div style={style}>
                        <Select filter style={{ width: '180px' }}>
                            <Select.Option value='abc'>abc</Select.Option>
                            <Select.Option value='vigo' disabled>vigo</Select.Option>
                            <Select.Option value='hotsoon'>hotsoon</Select.Option>
                        </Select>
                        <Cascader
                            style={{ width: 300, margin: 10 }}
                            treeData={treeData}
                            filterTreeNode
                            insetLabel='Cascader'
                        />
                    </div>
                    <h5>DatePicker</h5>
                    <DatePicker style={{ ...style, width: 250 }} />
                    <DatePicker style={{ ...style, width: 300 }} type='dateTime' />
                    <DatePicker style={{ ...style, width: 300 }} type='dateRange' />
                    <DatePicker style={{ ...style, width: 450 }} type='dateTimeRange' />
                    <h5>TimePicker</h5>
                    <TimePicker style={style} />
                    <TimePicker use12Hours style={style} /><br/><br/>
                    <h5>TreeSelect</h5>
                    <TreeSelect
                        style={{ ...style, width: 300 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        filterTreeNode
                    />
                    <h5>Table</h5>
                    <Table columns={columns} dataSource={dataSource} scroll={{ y: 320 }} />
                    <h5>Table - Empty</h5>
                    <Table columns={columns} dataSource={[]} scroll={{ y: 320 }} />
                    <h5>List - Empty</h5>
                    <List header={<div>List</div>} dataSource={[]}/>
                    <h5>Calendar</h5>
                    <Calendar mode='month' />
                    <h5>Typography - Copyable</h5>
                    <Typography.Paragraph copyable>Click to copy text.</Typography.Paragraph>
                    <h5>Typography - Collapsible</h5>
                    <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, collapsible: true }} style={{ width: 300 }}>
                        支持展开和折叠：Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
                    </Typography.Paragraph>
                    <h5>Transfer</h5>
                    <Transfer
                        style={{ width: 568, height: 416 }}
                        dataSource={transferData}
                    />
                    <h5>Image</h5>
                    <ImagePreview showTooltip>
                        {srcList.map((src, index) => {
                            return (
                                <Image 
                                    key={index} 
                                    src={src} 
                                    width={200} 
                                    alt={`lamp${index + 1}`} 
                                    style={{ marginRight: 5 }}
                                />
                            );
                        })}
                    </ImagePreview>
                    <h5>Form</h5>
                    <Form layout='horizontal' onValueChange={values=>console.log(values)}>
                        <Form.Input field='UserName' label={{ text: '角色', optional: true }} style={{ width: 200 }} />
                    </Form>
                    <h5>Navigation</h5>
                    <Nav
                        bodyStyle={{ height: 320 }}
                        items={[
                            { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                            { itemKey: 'union', text: '活动管理', icon: <IconStar /> },
                        ]}
                        header={{
                            logo: <IconSemiLogo style={{ height: '36px', fontSize: 36 }} />,
                            text: 'Semi 数据后台'
                        }}
                        footer={{
                            collapseButton: true,
                        }}
                    />
                </>
            );
        };
        return (
            <>
                <div style={{ borderBottom: '1px solid var(--semi-color-border)', paddingBottom: 20 }}>
                    <Select onChange={this.onLanguageChange} insetLabel='切换语言' style={{ width: 250 }} defaultValue='zh_CN'>
                        <Select.Option value='zh_CN'>简体中文</Select.Option>
                        <Select.Option value='en_US'>英语（美）</Select.Option>
                        <Select.Option value='en_GB'>英语（英）</Select.Option>
                        <Select.Option value='ja_JP'>日语</Select.Option>
                        <Select.Option value='ko_KR'>韩语</Select.Option>
                        <Select.Option value='ar'>阿拉伯语</Select.Option>
                        <Select.Option value='vi_VN'>越南语</Select.Option>
                        <Select.Option value='ru_RU'>俄罗斯语</Select.Option>
                        <Select.Option value='id_ID'>印尼语</Select.Option>
                        <Select.Option value='ms_MY'>马来语</Select.Option>
                        <Select.Option value='th_TH'>泰语</Select.Option>
                        <Select.Option value='tr_TR'>土耳其语</Select.Option>
                        <Select.Option value='pt_BR'>葡萄牙语（巴西）</Select.Option>
                        <Select.Option value='zh_TW'>繁体中文</Select.Option>
                        <Select.Option value='es'>西班牙语</Select.Option>
                        <Select.Option value='de'>德语</Select.Option>
                        <Select.Option value='it'>意大利语</Select.Option>
                        <Select.Option value='fr'>法语</Select.Option>
                        <Select.Option value='ro'>罗马尼亚语</Select.Option>
                        <Select.Option value='sv_SE'>瑞典语</Select.Option>
                        <Select.Option value='pl_PL'>波兰语</Select.Option>
                        <Select.Option value='nl_NL'>荷兰语</Select.Option>
                    </Select>
                </div>
                <LocaleProvider locale={locale}>
                    <ConfigProvider direction={localeCode === 'ar' ? 'rtl' : 'ltr'} locale={locale}>
                        <I18nComponent />
                    </ConfigProvider>
                </LocaleProvider>
            </>
        );
    }
}
```
