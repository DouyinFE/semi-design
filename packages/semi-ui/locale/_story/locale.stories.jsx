import React from 'react';
import { useState, useMemo } from 'react';
import {
    Pagination,
    Cascader,
    LocaleProvider,
    ConfigProvider,
    Space,
    Modal,
    Button,
    Select,
    DatePicker,
    TreeSelect,
    Table,
    TimePicker,
    List,
    Calendar,
    Typography,
    Transfer,
    ImagePreview,
    Image,
    Form,
    Nav,
} from '../../index';

import zh_CN from '@douyinfe/semi-ui/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/locale/source/en_GB';
import en_US from '@douyinfe/semi-ui/locale/source/en_US';
import ko_KR from '@douyinfe/semi-ui/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/locale/source/ja_JP';
import ru_RU from '@douyinfe/semi-ui/locale/source/ru_RU';
import vi_VN from '@douyinfe/semi-ui/locale/source/vi_VN';
import ar from '@douyinfe/semi-ui/locale/source/ar';
import id_ID from '@douyinfe/semi-ui/locale/source/id_ID';
import ms_MY from '@douyinfe/semi-ui/locale/source/ms_MY';
import th_TH from '@douyinfe/semi-ui/locale/source/th_TH';
import tr_TR from '@douyinfe/semi-ui/locale/source/tr_TR';
import pt_BR from '@douyinfe/semi-ui/locale/source/pt_BR';
import zh_TW from '@douyinfe/semi-ui/locale/source/zh_TW';
import sv_SE from '@douyinfe/semi-ui/locale/source/sv_SE';
import pl_PL from '@douyinfe/semi-ui/locale/source/pl_PL';
import nl_NL from '@douyinfe/semi-ui/locale/source/nl_NL';
import es from '@douyinfe/semi-ui/locale/source/es';
import it from '@douyinfe/semi-ui/locale/source/it';
import de from '@douyinfe/semi-ui/locale/source/de';
import fr from '@douyinfe/semi-ui/locale/source/fr';
import ro from '@douyinfe/semi-ui/locale/source/ro';
import { IconUser, IconSemiLogo, IconStar } from '@douyinfe/semi-icons';

const { Option } = Select;

export default {
    title: 'LocaleProvider',
};
// -√ Pagination
// -√ Modal
// -× DatePicker
// -√ Table
// -√ Select
// -× Calendar
// -√ Timepicker

const TableDemo = () => {};

const CascaderDemo = () => {
    const treeData = [
        {
            label: '亚洲',
            value: 'yazhou',
            children: [
                {
                    label: '中国',
                    value: 'zhongguo',
                    children: [
                        {
                            label: '北京',
                            value: 'beijing',
                        },
                        {
                            label: '上海',
                            value: 'shanghai',
                        },
                    ],
                },
                {
                    label: '日本',
                    value: 'riben',
                    children: [
                        {
                            label: '大阪',
                            value: 'daban',
                        },
                    ],
                },
            ],
        },
    ];
    return <Cascader style={{ width: 300, margin: 10 }} treeData={treeData} filterTreeNode />;
};

const I18nComponent = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const style = { margin: 10 };
    const presets = [
        {
            text: 'Today',
            start: new Date(),
            end: new Date(),
        },
        {
            text: 'Tomorrow',
            start: new Date(new Date().valueOf() + 1000 * 3600 * 24),
            end: new Date(new Date().valueOf() + 1000 * 3600 * 24),
        },
    ];
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
        for (let i = 0; i < 1; i++) {
            data.push({
                key: '' + i,
                name: `Bytedance ${i}`,
                age: 32,
                address: `Beijing, Haidian. Zhichun Road ${i}`,
            });
        }
        return data;
    });



    return (
        <>
            <Pagination total={100} showTotal showSizeChanger style={style} />
            <Table columns={columns} dataSource={dataSource} scroll={{ y: 320 }} />

            <div style={style}>
                <Button onClick={() => setModalVisible(true)}>Show Modal</Button>
            </div>
            <div style={style}>
                <Select filter style={{ width: '180px' }}>
                    <Option value="abc">abc</Option>
                    <Option value="vigo" disabled>
                        vigo
                    </Option>
                    <Option value="hotsoon">hotsoon</Option>
                </Select>
                <CascaderDemo />
            </div>
            <Modal
                title="Modal"
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                <p>This is the content of a basic modal.</p>
                <p>More content...</p>
            </Modal>
            <div>
              <DatePicker style={{ ...style, width: 200 }} open defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
              <DatePicker style={{ ...style,marginLeft:120, width: 250 }} open type="dateTime" presets={presets} presetPosition="left" defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
              {/* <DatePicker style={{ ...style, width: 250 }} type="dateRange" /> */}
              <DatePicker style={{ ...style, marginLeft:240, width: 400 }} open type="dateTimeRange" defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
            </div>
            <div style={{ marginTop: 400 }}>
              <DatePicker style={{ ...style, width: 200 }} open autoAdjustOverflow={false} position='bottomLeft' density='compact' defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
              <DatePicker style={{ ...style,marginLeft:120, width: 250 }} open type="dateTime" presets={presets} presetPosition="left" autoAdjustOverflow={false} position='bottomLeft' density='compact'  defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
              {/* <DatePicker style={{ ...style, width: 250 }} type="dateRange" /> */}
              <DatePicker style={{ ...style, marginLeft:240, width: 400 }} open type="dateTimeRange" autoAdjustOverflow={false} position='bottomLeft' density='compact' defaultPickerValue={[new Date('2024-09-08 00:00'), new Date('2024-09-09 12:00')]} />
            </div>
            <br />
            <br />
            <div style={{ marginTop: 400 }}>
              <TimePicker style={style} />
              <TimePicker use12Hours style={style} />
            </div>
            <br />
            <br />
        </>
    );
};

export const LocaleZhCn = () => (
    <LocaleProvider locale={zh_CN}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleEnGb = () => (
    <LocaleProvider locale={en_GB}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleEnUs = () => (
    <LocaleProvider locale={en_US}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleJaJp = () => (
    <LocaleProvider locale={ja_JP}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleKoKr = () => (
    <LocaleProvider locale={ko_KR}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleAr = () => (
    <LocaleProvider locale={ar}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleViVn = () => (
    <LocaleProvider locale={vi_VN}>
        <I18nComponent />
    </LocaleProvider>
);
export const LocaleRuRu = () => (
    <LocaleProvider locale={ru_RU}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleIdID = () => (
    <LocaleProvider locale={id_ID}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleMsMY = () => (
    <LocaleProvider locale={ms_MY}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleThTH = () => (
    <LocaleProvider locale={th_TH}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleTrTR = () => (
    <LocaleProvider locale={tr_TR}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocalePtBR = () => (
    <LocaleProvider locale={pt_BR}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleES = () => (
    <LocaleProvider locale={es}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleDe = () => (
    <LocaleProvider locale={de}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleIt = () => (
    <LocaleProvider locale={it}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleFr = () => (
    <LocaleProvider locale={fr}>
        <I18nComponent />
    </LocaleProvider>
);

export const LocaleRo = () => (
    <LocaleProvider locale={ro}>
        <I18nComponent />
    </LocaleProvider>
);

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
                children: [{ label: 'Osaka', value: 'osaka', key: '1-1-0' }],
            },
        ],
    },
];

const I18nComponent2 = () => {
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
    const srcList = useMemo(
        () => [
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/sky.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/greenleaf.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg',
        ],
        []
    );
    const style = { margin: 10 };
    return (
        <>
            <h5>Pagination</h5>
            <Pagination total={100} showTotal showSizeChanger style={style} />
            <h5>Modal</h5>

            <div style={style}>
                <Button onClick={() => setModalVisible(true)}>Show Modal</Button>
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
                    <Select.Option value="abc">abc</Select.Option>
                    <Select.Option value="vigo" disabled>
                        vigo
                    </Select.Option>
                    <Select.Option value="hotsoon">hotsoon</Select.Option>
                </Select>
                <Cascader
                    style={{ width: 300, margin: 10 }}
                    treeData={treeData}
                    filterTreeNode
                    insetLabel="Cascader"
                />
            </div>
            <h5>DatePicker</h5>
            <DatePicker style={{ ...style, width: 250 }} />
            <DatePicker style={{ ...style, width: 300 }} type="dateTime" />
            <DatePicker style={{ ...style, width: 300 }} type="dateRange" />
            <DatePicker style={{ ...style, width: 450 }} type="dateTimeRange" />
            <h5>TimePicker</h5>
            <TimePicker style={style} />
            <TimePicker use12Hours style={style} />
            <br />
            <br />
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
            <List header={<div>List</div>} dataSource={[]} />
            <h5>Calendar</h5>
            <Calendar mode="month" displayValue={new Date('2024-02-01')} />
            <h5>Typography - Copyable</h5>
            <Typography.Paragraph copyable>Click to copy text.</Typography.Paragraph>
            <h5>Typography - Collapsible</h5>
            <Typography.Paragraph
                ellipsis={{ rows: 3, expandable: true, collapsible: true }}
                style={{ width: 300 }}
            >
                支持展开和折叠：Semi Design 是由抖音前端团队与 UED
                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                Web 应用。
            </Typography.Paragraph>
            <h5>Transfer</h5>
            <Transfer style={{ width: 568, height: 416 }} dataSource={transferData} />
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
            <Form layout="horizontal" onValueChange={values => console.log(values)}>
                <Form.Input field="UserName" label={{ text: '角色', optional: true }} style={{ width: 200 }} />
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
                    text: 'Semi 数据后台',
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        </>
    );
};

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
            zh_CN: zh_CN,
            en_GB: en_GB,
            ko_KR: ko_KR,
            ja_JP: ja_JP,
            ar: ar,
            vi_VN: vi_VN,
            ru_RU: ru_RU,
            id_ID: id_ID,
            ms_MY: ms_MY,
            th_TH: th_TH,
            tr_TR: tr_TR,
            pt_BR: pt_BR,
            zh_TW: zh_TW,
            es: es,
            sv_SE: sv_SE,
            pl_PL: pl_PL,
            nl_NL: nl_NL,
            de,
            it,
            fr,
            ro,
        };
        this.setState({ locale: language[code], localeCode: code });
    }

    render() {
        const { locale, localeCode } = this.state;
        return (
            <>
                <div style={{ borderBottom: '1px solid var(--semi-color-border)', paddingBottom: 20 }}>
                    <Select
                        onChange={this.onLanguageChange}
                        insetLabel="切换语言"
                        style={{ width: 250 }}
                        defaultValue="zh_CN"
                    >
                        <Select.Option value="zh_CN">简体中文</Select.Option>
                        <Select.Option value="en_GB">英语（英）</Select.Option>
                        <Select.Option value="ja_JP">日语</Select.Option>
                        <Select.Option value="ko_KR">韩语</Select.Option>
                        <Select.Option value="ar">阿拉伯语</Select.Option>
                        <Select.Option value="vi_VN">越南语</Select.Option>
                        <Select.Option value="ru_RU">俄罗斯语</Select.Option>
                        <Select.Option value="id_ID">印尼语</Select.Option>
                        <Select.Option value="ms_MY">马来语</Select.Option>
                        <Select.Option value="th_TH">泰语</Select.Option>
                        <Select.Option value="tr_TR">土耳其语</Select.Option>
                        <Select.Option value="pt_BR">葡萄牙语（巴西）</Select.Option>
                        <Select.Option value="zh_TW">繁体中文</Select.Option>
                        <Select.Option value="es">西班牙语</Select.Option>
                        <Select.Option value="de">德语</Select.Option>
                        <Select.Option value="it">意大利语</Select.Option>
                        <Select.Option value="fr">法语</Select.Option>
                        <Select.Option value="ro">罗马尼亚语</Select.Option>
                    </Select>
                </div>
                <LocaleProvider locale={locale}>
                    <ConfigProvider direction={localeCode === 'ar' ? 'rtl' : 'ltr'} locale={locale}>
                        <I18nComponent2 />
                    </ConfigProvider>
                </LocaleProvider>
            </>
        );
    }
}

export const Locale = () => <I18nDemo />;
