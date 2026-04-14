---
localeCode: zh-CN
order: 42
category: 输入类
title: InputNumber 数字输入框
icon: doc-inputnumber
brief: 通过鼠标或键盘，输入范围内的数值，与 Input 不同的是它带有针对数字场景的步进器操作区，配合 Parser 使用可以展示更复杂的内容格式
---

## 代码演示

### 如何引入

```jsx import
import { InputNumber } from '@douyinfe/semi-ui';
```
### 基本输入框

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 280 }}>
        <label>简单数字输入框</label>
        <InputNumber />
        <br/><br/>

        <label>设置了步长 step=2 </label>
        <InputNumber step={2} />
        <br/><br/>

        <label>设置 shiftStep=100， 按住 shift 同时点击按钮，可以一次增加/减少100 </label>
        <InputNumber shiftStep={100} />
        <br/><br/>

        <label>设置了上下界 min=1,max=10</label>
        <InputNumber min={1} max={10} defaultValue={1} />
        <br/><br/>
    </div>
);
```

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 280 }}>
        <label>设置了默认值 defaultValue=1 </label>
        <InputNumber defaultValue={1} />
        <br/><br/>

        <label>禁用 disabled=true</label>
        <InputNumber defaultValue={2} disabled />
        <br/><br/>

        <label>设置了小数位数 precision=2 </label>
        <InputNumber precision={2} defaultValue={1.234} />
        <br/><br/>

        <label>设置了 innerButtons=true </label>
        <InputNumber innerButtons={true} suffix={'小时'} defaultValue={1} style={{ width: 190 }} />
        <br/>
    </div>
);
```


### 隐藏步进器

通过innerButtons，你可以将右侧的步进器隐藏进内部，仅hover时才会显示

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber innerButtons style={{ width: 190 }} />
);
```

hideButtons设为true，彻底隐藏步进器

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber hideButtons style={{ width: 190 }} />
);
```

### 尺寸

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 180 }}>
        <label>默认尺寸 size=default</label>
        <InputNumber />
        <br/><br/>

        <label>大尺寸 size=large</label>
        <InputNumber size="large" />
        <br/><br/>

        <label>小尺寸 size=small</label>
        <InputNumber size="small" />
        <br/>
    </div>
);
```

### 自定义显示格式与解析方式

> formatter 和 parser 一对方法，一般需要同时设置，否则无法正确解析值

<Notice type="info" title="2.95.0 行为调整">

- **2.94.0 及之前**：当 InputNumber 处于**受控模式**（传入 `value`）且 `value` 为 **number** 时，首次渲染阶段输入框的展示值可能不会先经过 `formatter` 处理，组件会在 mount 后（或后续更新）再应用 `formatter/parser`，从而出现首帧展示与后续不一致的现象。
- **2.95.0 及之后**：受控模式下当 `value` 为 **number** 时，首次渲染也会应用 `formatter`（并与 `parser` 配合得到内部数值），保证首帧展示与后续一致。例如百分比场景：`value=1` 且 `formatter/parser` 使展示乘以 100 时，首帧将直接展示 `100`。

</Notice>

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => {
    const log = (v) => {
        console.log(`Changed to: [${typeof v}] ${v}`);
    };

    return (
        <div style={{ width: 180 }}>
            <label>人民币</label>
            <InputNumber
                onChange={this.log}
                defaultValue={1000}
                min={0}
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\￥\s?|(,*)/g, '')}
            />
            <br/><br/>

            <label>自定义串</label>
            <InputNumber
                onChange={this.log}
                defaultValue={1111}
                formatter={value => String(value).split('').join('-')}
                parser={value => value.replace(/\-/g, '')}
            />
            <br/>
        </div>
    );
};
```

### 纯数字输入框
搭配 formatter 和 onNumberChange（**>=v1.9.0**） 可以实现纯数字输入框。

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

function Demo () {
    return (
        <InputNumber
            formatter={value => `${value}`.replace(/\D/g, '')}
            onNumberChange={number => console.log(number)}
            min={0}
            max={Number.MAX_SAFE_INTEGER}
        />
    );
}
```

### 货币展示
2.77.0 版本开始支持货币展示，国际化模式下通过 currency={true} 开启，组件会自动根据 localeCode 展示对应货币种类。（注意切换语言类型后需要更新组件 key 值）
```jsx live=true
import React, { useCallback, useMemo, useState } from 'react';
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
import { LocaleProvider, InputNumber, Select } from '@douyinfe/semi-ui';

function I18nDemo() {
    const [locale, setLocale] = useState(zh_CN);
    const [localeCode, setLocaleCode] = useState('zh_CN');

    const language = useMemo(() => ({
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
    }), []);

    const onLanguageChange = (code) => {
        setLocale(language[code]);
        setLocaleCode(code);
    };

    return (
        <>
            <div style={{ paddingBottom: 20 }}>
                <Select onChange={onLanguageChange} insetLabel='切换语言' style={{ width: 250 }} defaultValue='zh_CN'>
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
                <InputNumber key={localeCode} currency={true} defaultValue={123456.78} />
            </LocaleProvider>
        </>
    );
}
```
也可以通过手动传 localeCode 和 currency 指定展示的货币种类
```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => {
    const defaultValue = 123456.78;
    return (
        <div>
            <div>🇨🇳 人民币</div>
            <InputNumber localeCode="zh-CN" currency="CNY" defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇪🇺 欧元</div>
            <InputNumber localeCode="de-DE" currency="EUR" defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇯🇵 日元</div>
            <InputNumber localeCode="ja-JP" currency="JPY" defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇻🇳 越南盾</div>
            <InputNumber localeCode="vi-VN" currency="VND" defaultValue={defaultValue} />
            <br />
            <br />
        </div>
    );
};
```
支持 symbol、code、name 三种展示方式，通过 currencyDisplay 属性控制，默认以货币符号展示。showCurrencySymbol 设置为 false 隐藏货币符号/代码/名称的展示
```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';    

() => {
    const defaultValue = 123456.78;
    return (
        <div>
            <div>🇨🇳 CNY ➕ code</div>
            <InputNumber currency="CNY" currencyDisplay="code" defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇨🇳 CNY ➕ symbol</div>
            <InputNumber currency="CNY" currencyDisplay="symbol" defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇨🇳 CNY ➕ name</div>
            <InputNumber currency="CNY" currencyDisplay="name" defaultValue={defaultValue} />
            <br />
            <br />
        </div>
    );
};
```

隐藏货币符号、代码或名称的展示，通过前后缀展示货币符号
```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';    

() => {
    const defaultValue = 123456.78;
    return (
        <div>
            <div>🇨🇳 CNY ➕ code</div>
            <InputNumber style={{ width: 200 }} currency="CNY" prefix="CNY" showCurrencySymbol={false} defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇨🇳 CNY ➕ symbol</div>
            <InputNumber style={{ width: 200 }} currency="CNY" prefix="￥" showCurrencySymbol={false} defaultValue={defaultValue} />
            <br />
            <br />
            <div>🇨🇳 CNY ➕ name</div>
            <InputNumber style={{ width: 200 }} currency="CNY" suffix="人民币" showCurrencySymbol={false} defaultValue={defaultValue} />
            <br />
            <br />
        </div>
    );
};
```

## API 参考

| 属性         | 说明                                                           | 类型                              | 默认值    | 版本      |
| ------------ | -------------------------------------------------------------- | --------------------------------- | --------- | --------- |
| autofocus    | 自动获取焦点                                                   | boolean                           | false     |           |
| className | 类名                                                               | string  | -      |
| clearIcon | 可用于自定义清除按钮, showClear为true时有效 | ReactNode |   | 2.25.0|
| currency | 货币种类，国际化模式下通过 currency={true} 开启，组件会自动根据 locale 展示对应货币种类, 也可以手动传入 localeCode 和 currency 指定展示的货币种类, currency 的可选值有 `CNY`,`EUR`,`USD`等| boolean\|string | false | **2.77.0** |
| currencyDisplay | 货币展示方式，可选值：symbol、code、name | string | symbol | **2.77.0** |
| defaultValue | 默认值                                                         | number                            |           |           |
| disabled     | 禁用                                                           | boolean                           | false     |           |
| formatter    | 指定输入框展示值的格式                                         | (value: number\|string) => string | -         |           |
| hideButtons  | 为 `true` 时隐藏 “上/下” 按钮                                  | boolean                           | false     | - |
| innerButtons | 为 `true` 时 “上/下” 按钮显示在输入框内部                                  | boolean                           | false     | - |
| keepFocus    | 点击按钮时保持输入框聚焦                                        | boolean                 |     false      |   -        |
|  localeCode    | 货币模式下用于指定国家地区代码，可选值有 `zh-CN`, `en-US`, `en-GB`, `ja-JP`, `ko-KR`, `ar`, `vi-VN`, `ru-RU`, `id-ID`, `ms-MY`, `th-TH`, `tr-TR`, `pt-BR`, `zh-TW`, `es`, `de`, `it`, `fr`, `ro`, `sv-SE`, `pl-PL`, `nl-NL`等 | string                 |     -      |   **2.77.0**  |
| max          | 限定最大值                                                     | number                            | Infinity  |           |
| min          | 限定最小值                                                     | number                            | -Infinity |           |
| parser       | 指定从 `formatter` 里转换回数字串的方式，和 `formatter` 搭配使用 | (str: string) => string           | -         |           |
| precision    | 数值精度                                                       | number                            | -         |           |
| prefix    | 前缀内容                                                       | string\|ReactNode                 |           |           |
| pressInterval| 长按按钮时，多久触发一次点击事件，单位毫秒                                   | number                 |   250        |           |
| pressTimeout | 长按按钮时，延迟多久后触发点击事件，单位毫秒                                                      | number                 |     250      |           |
| preventScroll | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法 | boolean |  |  |
| shiftStep    | 按住 shift 键每次改变步数，可以为小数，v2.13 默认值由 1 调整为 10                           | number                            | 10         | - |
| showClear    | 是否显示清除按钮                                               | boolean                           | false     | -   |
| showCurrencySymbol | 是否显示货币符号/代码/名称，仅货币模式下生效 | boolean | true | **2.77.0** |
| size         | 输入框大小，可选值："default"\|"small"\|"large"                | string                            | 'default' |           |
| step         | 每次改变步数，可以为小数                                       | number                            | 1         |           |
| style     | 样式                                                               | CSSProperties  | -      |
| suffix       | 自定义后缀                                                     | ReactNode                         |           |           |
| value        | 当前值                                                         | number                            |           |           |
| onBlur       | 失去焦点时的回调                                               | (e: domEvent) => void             | () => {}  | - |
| onChange     | 变化回调                                                       | (value: number\|string) => void   | -         |           |
| onFocus      | 获得焦点时的回调                                               | (e: domEvent) => void             | () => {}  | - |
| onNumberChange | 数字变化回调                                                  | (value: number) => void   | -         |     -      |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移出焦点 |
| focus() | 获取焦点 |


## Accessibility

参考标准：https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

### ARIA

- 数字输入框具有 spinbutton role
- spinbutton 使用 aria-valuenow 表示当前值，aria-valuemax 表示可以接受的最大值，aria-valuemin 表示可以接受的最小值
- 当 InputNumber 在 Form 中使用时，输入框的 aria-labeledby 指向 Field label

### 键盘和焦点

- InputNumber 可被获取焦点，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点（增加/减少按钮不可以被键盘聚焦）
- 键盘用户可以按上键 ⬆️ 或下键 ⬇️ ，输入值将增加或减少 step（默认值为 1）
- 按住 Shift + 上键 ⬆️ 或下键 ⬇️ ，输入值将增加或减少 shiftStep（默认值为 10）

## 设计变量
<DesignToken/>
