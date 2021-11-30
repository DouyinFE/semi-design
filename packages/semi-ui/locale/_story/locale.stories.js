import React from 'react';
import { useState } from 'react';
import {
  Modal,
  Pagination,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Cascader,
  LocaleProvider
} from '../../index';

import zh_CN from '@douyinfe/semi-ui/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/locale/source/en_GB';
import en_US from '@douyinfe/semi-ui/locale/source/en_US';
import ko_KR from '@douyinfe/semi-ui/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/locale/source/ja_JP';
import ru_RU from '@douyinfe/semi-ui/locale/source/ru_RU';
import vi_VN from '@douyinfe/semi-ui/locale/source/vi_VN';

const { Option } = Select;

export default {
  title: 'LocaleProvider'
}
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
  return (
    <>
      <Pagination total={100} showTotal showSizeChanger style={style} />
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
      <DatePicker style={{ ...style, width: 200 }} />
      <DatePicker style={{ ...style, width: 250 }} type="dateTime" />
      <DatePicker style={{ ...style, width: 250 }} type="dateRange" />
      <DatePicker style={{ ...style, width: 400 }} type="dateTimeRange" />
      <TimePicker style={style} />
      <TimePicker use12Hours style={style} />
      <br />
      <br />
    </>
  );
};

class I18nDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: zh_CN,
    };
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onLanguageChange(code) {
    let language = {
      zh_CN: zh_CN,
      en_GB: en_GB,
      ko_KR: ko_KR,
      ja_JP: ja_JP,
    };
    this.setState({ locale: language[code] });
  }

  render() {
    const { locale } = this.state;
    return (
      <>
        <Select onChange={this.onLanguageChange}>
          <Option value="zh_CN">中文</Option>
          <Option value="en_GB">英语（英）</Option>
          <Option value="ja_JP">日语</Option>
          <Option value="ko_KR">韩语</Option>
        </Select>
        <hr />
        <LocaleProvider locale={locale}>
          <I18nComponent />
        </LocaleProvider>
      </>
    );
  }
}

export const LocaleZhCn = () => (
  <LocaleProvider locale={zh_CN}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleZhCn.story = {
  name: 'Locale zh_CN',
};

export const LocaleEnGb = () => (
  <LocaleProvider locale={en_GB}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleEnGb.story = {
  name: 'Locale en-GB',
};

export const LocaleEnUs = () => (
  <LocaleProvider locale={en_US}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleEnUs.story = {
  name: 'Locale en-US',
};

export const LocaleJaJp = () => (
  <LocaleProvider locale={ja_JP}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleJaJp.story = {
  name: 'Locale ja_JP',
};

export const LocaleKoKr = () => (
  <LocaleProvider locale={ko_KR}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleKoKr.story = {
  name: 'Locale ko_KR',
};

export const LocaleRuRu = () => (
  <LocaleProvider locale={ru_RU}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleRuRu.story = {
  name: 'Locale ru_RU',
};

export const LocaleViVn = () => (
  <LocaleProvider locale={vi_VN}>
    <I18nComponent />
  </LocaleProvider>
);

LocaleViVn.story = {
  name: 'Locale vi_VN',
};

export const Locale = () => <I18nDemo />;
