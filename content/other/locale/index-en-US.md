---
localeCode: en-US
order: 68
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

## Components supported

> Date Picker, Time Picker, Modal, Pagination, Select, Table, Cascader, Tree Select、List、Typography、Transfer

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
import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';

import { LocaleProvider } from '@douyinfe/semi-ui';


return (
    <LocaleProvider locale={en_GB}>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <App />
    </LocaleProvider>
);
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
                    <Pagination total={100} showTotal showSizeChanger style={{margin: 20}} />
                </LocaleProvider>
                <LocaleProvider locale={ja_JP}>
                    <Pagination total={100} showTotal showSizeChanger style={{margin: 20}} />
                </LocaleProvider>
            </>
        );
    }
}
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
import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';
import { LocaleProvider, ConfigProvider, Pagination, Modal, Button, Select, Cascader, DatePicker, TreeSelect, Table, TimePicker, List, Calendar, Typography } from '@douyinfe/semi-ui';

const { Option } = Select;

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
                        name: `Edward King ${i}`,
                        age: 32,
                        address: `London, Park Lane no. ${i}`,
                    });
                }
                return data;
            });
            const style = { margin: 10 };
            return (
                <>
                    <h5>Pagination</h5>
                    <Pagination total={100} showTotal showSizeChanger style={style} />
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
                            <Option value='abc'>abc</Option>
                            <Option value='vigo' disabled>vigo</Option>
                            <Option value='hotsoon'>hotsoon</Option>
                        </Select>
                        <Cascader
                            style={{ width: 300, margin: 10 }}
                            treeData={treeData}
                            filterTreeNode
                            insetLabel='Cascader'
                        />
                    </div>
                    <h5>DatePicker</h5>
                    <DatePicker style={{ ...style, width: 250}} />
                    <DatePicker style={{ ...style, width: 300}} type='dateTime' />
                    <DatePicker style={{ ...style, width: 300}} type='dateRange' />
                    <DatePicker style={{ ...style, width: 450}} type='dateTimeRange' />
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
                </>
            );
        };
        return (
            <>
                <div style={{ borderBottom: '1px solid var(--semi-color-border)', paddingBottom: 20 }}>
                    <Select onChange={this.onLanguageChange} insetLabel='Switch Language' style={{width: 250}} defaultValue='en_GB'>
                        <Option value='zh_CN'>Chinese</Option>
                        <Option value='en_GB'>English</Option>
                        <Option value='ja_JP'>Japanese</Option>
                        <Option value='ko_KR'>Korean</Option>
                        <Option value='ar'>Arabic</Option>
                        <Option value='vi_VN'>Vietnamese</Option>
                        <Option value='ru_RU'>Russian</Option>
                        <Option value='id_ID'>Indonesian</Option>
                        <Option value='ms_MY'>Malay</Option>
                        <Option value='th_TH'>Thai</Option>
                        <Option value='tr_TR'>Turkish</Option>
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

