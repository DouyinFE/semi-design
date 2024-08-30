---
localeCode: en-US
order: 83
category: Other
title: LocaleProvider
subTitle: LocaleProvider
icon: doc-i18n
dir: column
brief: Internationalized components to provide multilingual support for Semi components
---


## Languages supported

| Minimum supported version  | Language |
| ----------- | ----------- |
| v0.0.1      | Simplified Chinese: zh_CN|
| v0.7.0      | English: en_GB, Japanese: ja_JP, Korean: ko_KR      |
| v1.8.0      | Arabic: ar      |
| v1.11.0     | Vietnamese: vi_VN、Russian: ru_RU、Indonesian: id_ID、Malay: ms_MY、Thai: th_TH、Turkish: tr_TR |
| v1.17.0     | Portuguese: pt_BR       |
| v1.28.0     | Traditional Chinese: zh_TW       |
| v2.2.0     | Spanish: es       |
| v2.15.0     | Italian: it、French：fr、German：de   |
| v2.21.0     | Romanian: ro   |
| v2.29.0     | Swedish: sv_SE、 Polish: pl_PL、Dutch: nl_NL |


## Components supported

> DatePicker、TimePicker、Modal、Pagination、Select、Table、Cascader、Calendar、TreeSelect、List、Typography、Transfer、Nav、Upload、Form、Navigation、Image

## How to use

`LocaleProvider` uses the context feature of React, and you only need to wrap the periphery of the application once to take effect globally.  
When you need to switch the language, you can directly switch the locale passed in by the props.

```jsx
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
import ro from '@douyinfe/semi-ui/lib/es/locale/source/fr';

import { LocaleProvider } from '@douyinfe/semi-ui';

() => {
    return (
        <LocaleProvider locale={en_GB}>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <App />
        </LocaleProvider>
    );
};
```

## Code example

### Internationalization

```jsx live=true dir="column"
import React from 'react';
import en_GB from '@douyinfe/semi-ui/locale/source/en_GB';
import ja_JP from '@douyinfe/semi-ui/locale/source/ja_JP';
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

### Custom Internationalization Component

When your custom component also wants to consume the localeCode in the Semi LocaleProvider Context or read the i18n text localeData of a specific component, you can use LocaleConsumer to get it

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

### Components that support multilingualism

The example gives all the current multilingual components

```jsx live=true dir="column"
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
import { LocaleProvider, ConfigProvider, Pagination, Modal, Button, Select, Cascader, DatePicker, TreeSelect, Table, TimePicker, List, Calendar, Typography, Transfer, ImagePreview, Image, Form, Nav } from '@douyinfe/semi-ui';
import { IconUser, IconSemiLogo, IconStar } from '@douyinfe/semi-icons';

class I18nDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: en_GB,
            localeCode: 'en_GB',
        };
        this.onLanguageChange = this.onLanguageChange.bind(this);
    }

    onLanguageChange(code) {
        let language = {
            'zh_CN': zh_CN,
            'en_GB': en_GB,
            'ko_KR': ko_KR,
            'ja_JP': ja_JP,
            'ar': ar,
            'vi_VN': vi_VN,
            'ru_RU': ru_RU,
            'id_ID': id_ID,
            'ms_MY': ms_MY,
            'th_TH': th_TH,
            'tr_TR': tr_TR,
            'sv_SE': sv_SE,
            'pl_PL': pl_PL,
            'nl_NL': nl_NL,
            es,
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
                        label: `Option Name ${i}`,
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
                    <Pagination total={100} showTotal showSizeChanger style={style} showQuickJumper/>
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
                        {`Expandable and collapsible: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
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
                        <Form.Input field='UserName' label={{ text: 'Role', optional: true }} style={{ width: 200 }} />
                    </Form>
                    <h5>Navigation</h5>
                    <Nav
                        bodyStyle={{ height: 320 }}
                        items={[
                            { itemKey: 'user', text: 'Users', icon: <IconUser /> },
                            { itemKey: 'union', text: 'Activity', icon: <IconStar /> },
                        ]}
                        header={{
                            logo: <IconSemiLogo style={{ height: '36px', fontSize: 36 }} />,
                            text: 'Semi Platform'
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
                    <Select onChange={this.onLanguageChange} insetLabel='Switch Language' style={{ width: 250 }} defaultValue='en_GB'>
                        <Select.Option value='zh_CN'>Chinese</Select.Option>
                        <Select.Option value='en_GB'>English</Select.Option>
                        <Select.Option value='ja_JP'>Japanese</Select.Option>
                        <Select.Option value='ko_KR'>Korean</Select.Option>
                        <Select.Option value='ar'>Arabic</Select.Option>
                        <Select.Option value='vi_VN'>Vietnamese</Select.Option>
                        <Select.Option value='ru_RU'>Russian</Select.Option>
                        <Select.Option value='id_ID'>Indonesian</Select.Option>
                        <Select.Option value='ms_MY'>Malay</Select.Option>
                        <Select.Option value='th_TH'>Thai</Select.Option>
                        <Select.Option value='tr_TR'>Turkish</Select.Option>
                        <Select.Option value='es'>Spanish</Select.Option>
                        <Select.Option value='de'>German</Select.Option>
                        <Select.Option value='it'>Italian</Select.Option>
                        <Select.Option value='fr'>French</Select.Option>
                        <Select.Option value='ro'>Romanian</Select.Option>
                        <Select.Option value='sv_SE'>Swedish</Select.Option>
                        <Select.Option value='pl_PL'>Polish</Select.Option>
                        <Select.Option value='nl_NL'>Dutch</Select.Option>
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

