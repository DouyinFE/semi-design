import React, { useRef, useState } from 'react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import './inputNumber.scss';
import InputNumber from '../index';
import Button from '../../button/index';
import { withField, Form } from '../../index';
import { useFormApi } from '../../form';
import { Space } from '../../index';

export default {
  title: 'InputNumber',
}

function log(v, e) {
  const type = typeof v;
  console.log(type, v);
}

const createOnChange = changeFn => {
  return (...args) => {
    log(...args);
    if (typeof changeFn === 'function') {
      changeFn(...args);
    }
  };
};

export const _InputNumber = () => {
  const Demo = () => {
    const [controlledValue, setControlledValue] = useState(10.1);
    const controlledOnChange = createOnChange(setControlledValue);

    const [controlledValue2, setControlledValue2] = useState(9);
    const controlledOnChange2 = createOnChange(setControlledValue2);

    const [decimal, setDecimal] = useState(10.01);
    const decimalOnChange = createOnChange(setDecimal);

    const [formattedVal, setFormattedVal] = useState(10.02);
    const formattedValOnChange = createOnChange(setFormattedVal);

    const [formattedDecimal, setFormattedDecimal] = useState(10.03);
    const formattedDecimalOnChange = createOnChange(setFormattedDecimal);

    return (
      <div className="inputNumber">
        <label>简单数字输入框</label>
        <InputNumber onChange={log} />
        <br />

        <label>限定上下界与整数步长</label>
        <InputNumber max={10} min={0} step={1} />
        <br />

        <label>限定上下界与小数步长</label>
        <InputNumber max={10} min={0} step={0.1} defaultValue={0.2} precision={2} />
        <br />

        <label>格式化</label>
        <InputNumber
          defaultValue={1000}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <label>小数（没有初始化值）</label>
        <InputNumber precision={2} onChange={log} />
        <br />

        <label>小数</label>
        <InputNumber defaultValue={10.08} precision={2} onChange={log} />
        <br />

        <label>格式化+小数</label>
        <InputNumber
          defaultValue={1000}
          precision={2}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <label>受控</label>
        <InputNumber value={controlledValue} onChange={controlledOnChange} />
        <br />

        <label>受控+上下界</label>
        <InputNumber min={1} max={10} value={controlledValue2} onChange={controlledOnChange2} />
        <br />

        <label>小数+受控</label>
        <InputNumber value={decimal} precision={2} onChange={decimalOnChange} />
        <br />

        <label>格式化+受控</label>
        <InputNumber
          defaultValue={1000}
          precision={0}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={formattedValOnChange}
          value={formattedVal}
        />
        <br />

        <label>格式化+小数+受控</label>
        <InputNumber
          precision={2}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={formattedDecimalOnChange}
          value={formattedDecimal}
        />
      </div>
    );
  };

  return <Demo />;
};

_InputNumber.story = {
  name: 'Input number',
};

export const InputnumberUseRefCallFocus = () => {
  const Demo = () => {
    const ref = useRef();
    const focus = () => {
      ref.current && ref.current.focus();
    };
    const blur = () => ref.current && ref.current.blur();

    return (
      <>
        <InputNumber ref={ref} />
        <Button onClick={focus}>focus</Button>
        <Button onClick={blur}>blur</Button>
      </>
    );
  };
  return <Demo />;
};

InputnumberUseRefCallFocus.story = {
  name: 'inputnumber use ref call focus',
};

export const UncontrolledInputNumber = () => {
  const Demo = function Demo(props = {}) {
    return (
      <div style={{ width: 450, padding: 20 }}>
        <h5>defaultValue</h5>
        <InputNumber defaultValue={1020} onChange={log} />
        <br />

        <h5>defaultValue + formatter + parser</h5>
        <InputNumber
          defaultValue={1020}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>defaultValue + precision + formatter + parser</h5>
        <InputNumber
          defaultValue={1020}
          precision={2}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>defaultValue + precision + max + min + formatter + parser</h5>
        <InputNumber
          defaultValue={1020}
          precision={2}
          onChange={log}
          max={1000}
          min={500}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />
      </div>
    );
  };

  return <Demo />;
};

UncontrolledInputNumber.story = {
  name: 'uncontrolled InputNumber',
};

export const ControlledInputNumber = () => {
  const ControlledDemo = function ControlledDemo(props = {}) {
    const [value, setValue] = useState(0);
    const _setValue = createOnChange(setValue);

    const [value1, setValue1] = useState(0.234);
    const _setValue1 = createOnChange(setValue1);

    const [value2, setValue2] = useState(1000);
    const _setValue2 = createOnChange(setValue2);

    const [value3, setValue3] = useState(0.21);
    const _setValue3 = createOnChange(setValue3);

    const [value4, setValue4] = useState(3);
    const randomSetValue4 = createOnChange(v => {
      setValue4(Math.random() * 3 + 1);
    });

    const [value5, setValue5] = useState(5);
    const randomSetValue5 = createOnChange(v => {
      setValue5(Math.random() * 5 + 1);
    });

    const [value6, setValue6] = useState(6);
    const randomSetValue6 = createOnChange(v => {
      const num = Math.random() * 10 + 9;
      console.log('random set: ', num);
      setValue6(num);
    });
    const _setValue6 = createOnChange(setValue6);

    return (
      <div style={{ width: 450, padding: 20 }}>
        <h5>defaultValue</h5>
        <InputNumber defaultValue={1020} onChange={log} />
        <br />
        <h5>value</h5>
        <InputNumber value={1000} onChange={log} />
        <br />
        <h5>value + onChange</h5>
        <InputNumber value={value} onChange={_setValue} onBlur={() => console.log('blur')} />
        <br />
        <h5>value + precision + onChange</h5>
        <InputNumber value={value1} onChange={_setValue1} precision={2} />
        <br />
        <h5>value + step + precision + onChange</h5>
        <InputNumber step={0.2} value={value3} onChange={_setValue3} precision={2} />
        <br />

        <h5>value + precision + onChange + formatter + parser</h5>
        <Button onClick={() => setValue2(undefined)}>Empty</Button>
        <InputNumber
          value={value2}
          precision={2}
          onChange={_setValue2}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>random set value + precision</h5>
        <Button onClick={randomSetValue4}>Random Set Value</Button>
        <InputNumber value={value4} precision={2} onChange={log} />
        <br />

        <h5>random set value + precision + formatter + parser</h5>
        <Button onClick={randomSetValue5}>Random Set Value</Button>
        <Button onClick={() => setValue5(undefined)}>Empty</Button>
        <InputNumber
          value={value5}
          precision={2}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>random set value + max + min + precision + onChange</h5>
        <Button onClick={randomSetValue6}>Random Set Value</Button>
        <Button onClick={() => setValue6(undefined)}>Empty</Button>
        <InputNumber max={18} min={-8} value={value6} precision={2} onChange={_setValue6} />
        <br />
      </div>
    );
  };

  return <ControlledDemo />;
};

ControlledInputNumber.story = {
  name: 'controlled InputNumber',
};

export const InnnerButtons = () => {
  const Demo = () => {
    return (
      <div style={{ width: 450 }}>
        <label>innerButtons=false</label>
        <div>
          <InputNumber innerButtons={false} />
        </div>
        <br />
        <label>innerButtons=true</label>
        <div>
          <InputNumber innerButtons={true} suffix={'小时'} min={0} />
        </div>
      </div>
    );
  };
  return <Demo />;
};

InnnerButtons.story = {
  name: 'innnerButtons',
};

export const ShiftStep = () => {
  const Demo = () => {
    return (
      <div style={{ width: 450 }}>
        <label>shiftStep=100，可长按</label>
        <div>
          <InputNumber shiftStep={100} />
        </div>
      </div>
    );
  };
  return <Demo />;
};

ShiftStep.story = {
  name: 'shiftStep',
};

export const OnChangeLimit = () => {
  const Demo = () => {
    const [disabled, setDisabled] = useState(true);
    const [disabled2, setDisabled2] = useState(false);
    const [val, setVal] = useState(2);

    return (
      <>
        <h3>数值没有持续变化说明正常，v1.10.0修复</h3>
        <br />
        <br />
        <div>点击2后点击输入框，然后点击按钮会触发</div>
        {disabled ? (
          <div
            onClick={() => {
              setDisabled(false);
            }}
          >
            {val}
          </div>
        ) : (
          <InputNumber
            style={{ width: 120 }}
            val={val}
            innerButtons
            onChange={res => setVal(res)}
          />
        )}
        <br />
        <br />
        <div>点击按钮后切换 disabled 状态</div>
        <div>disablde: {String(disabled2)}</div>
        <div>
          <InputNumber
            defaultValue={12}
            innerButtons
            disabled={disabled2}
            onChange={() => setDisabled2(true)}
          />
        </div>
      </>
    );
  };
  return <Demo />;
};

OnChangeLimit.story = {
  name: 'onChange无限触发问题',
};

export const ClearIconPosition = () => {
  const Demo = () => {
    return <InputNumber autoFocus defaultValue={12} innerButtons showClear />;
  };
  return <Demo />;
};

ClearIconPosition.story = {
  name: 'clear icon 位置',
};

export const UncontrolledKeepFocus = () => {
  const Demo = () => {
    const [val, setVal] = useState(2);
    const [val2, setVal2] = useState(2);

    return (
      <div style={{ width: 450, padding: 20 }}>
        <h5>defaultValue</h5>
        <InputNumber defaultValue={1020} onChange={log} keepFocus={true} />
        <br />
        <h5>defaultValue + formatter + parser</h5>
        <InputNumber
          keepFocus={true}
          defaultValue={1020}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />
        <h5>defaultValue + precision + formatter + parser</h5>
        <InputNumber
          keepFocus={true}
          defaultValue={1020}
          precision={2}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />
        <h5>defaultValue + precision + max + min + formatter + parser</h5>
        <InputNumber
          keepFocus={true}
          defaultValue={1020}
          precision={2}
          onChange={log}
          max={1000}
          min={500}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />
      </div>
    );
  };
  return <Demo />;
};

UncontrolledKeepFocus.story = {
  name: 'uncontrolled keepFocus',
};

export const ControlledKeepFocus = () => {
  const Demo = () => {
    const [value, setValue] = useState(0);
    const _setValue = createOnChange(setValue);

    const [value1, setValue1] = useState(0.234);
    const _setValue1 = createOnChange(setValue1);

    const [value2, setValue2] = useState(1000);
    const _setValue2 = createOnChange(setValue2);

    const [value3, setValue3] = useState(0.21);
    const _setValue3 = createOnChange(setValue3);

    const [value4, setValue4] = useState(3);
    const randomSetValue4 = createOnChange(v => {
      setValue4(Math.random() * 3 + 1);
    });

    const [value5, setValue5] = useState(5);
    const randomSetValue5 = createOnChange(v => {
      setValue5(Math.random() * 5 + 1);
    });

    const [value6, setValue6] = useState(6);
    const randomSetValue6 = createOnChange(v => {
      const num = Math.random() * 10 + 9;
      console.log('random set: ', num);
      setValue6(num);
    });
    const _setValue6 = createOnChange(setValue6);

    return (
      <div style={{ width: 450, padding: 20 }}>
        <h5>defaultValue</h5>
        <InputNumber keepFocus={true} defaultValue={1020} onChange={log} />
        <br />
        <h5>value</h5>
        <InputNumber keepFocus={true} value={1000} onChange={log} />
        <br />
        <h5>value + onChange</h5>
        <InputNumber
          keepFocus={true}
          value={value}
          onChange={_setValue}
          onBlur={() => console.log('blur')}
        />
        <br />
        <h5>value + precision + onChange</h5>
        <InputNumber keepFocus={true} value={value1} onChange={_setValue1} precision={2} />
        <br />
        <h5>value + step + precision + onChange</h5>
        <InputNumber
          keepFocus={true}
          step={0.2}
          value={value3}
          onChange={_setValue3}
          precision={2}
        />
        <br />

        <h5>value + precision + onChange + formatter + parser</h5>
        <Button onClick={() => setValue2(undefined)}>Empty</Button>
        <InputNumber
          keepFocus={true}
          value={value2}
          precision={2}
          onChange={_setValue2}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>random set value + precision</h5>
        <Button onClick={randomSetValue4}>Random Set Value</Button>
        <InputNumber keepFocus={true} value={value4} precision={2} onChange={log} />
        <br />

        <h5>random set value + precision + formatter + parser</h5>
        <Button onClick={randomSetValue5}>Random Set Value</Button>
        <Button onClick={() => setValue5(undefined)}>Empty</Button>
        <InputNumber
          keepFocus={true}
          value={value5}
          precision={2}
          onChange={log}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <br />

        <h5>random set value + max + min + precision + onChange</h5>
        <Button onClick={randomSetValue6}>Random Set Value</Button>
        <Button onClick={() => setValue6(undefined)}>Empty</Button>
        <InputNumber
          keepFocus={true}
          max={18}
          min={-8}
          value={value6}
          precision={2}
          onChange={_setValue6}
        />
        <br />
      </div>
    );
  };
  return <Demo />;
};

ControlledKeepFocus.story = {
  name: 'controlled keepFocus',
};

export const DisabledStyle = () => {
  const Demo = () => {
    return (
      <>
        <label>prop disabled</label>
        <InputNumber disabled />
        <br />
        <br />
        <label>max limit</label>
        <InputNumber min={1} max={10} defaultValue={10} />
        <br />
        <br />
        <label>min limit</label>
        <InputNumber min={1} max={10} defaultValue={1} />
        <br />
        <br />
      </>
    );
  };

  return <Demo />;
};

DisabledStyle.story = {
  name: 'disabled style',
};

export const FormCustomInput = () => {
  const Demo = () => {
    const CustomInput = withField(InputNumber, { onKeyChangeFnName: 'onNumberChange' });

    return (
      <>
        <h4>not controlled + without formatter</h4>
        <InputNumber
          onChange={(...args) => console.log('inputNumber change', ...args)}
          onNumberChange={(...args) => console.log('inputNumber number change', ...args)}
        />
        <h4>not controlled + formatter（onChange会包括英文字符，onNumberChange不包括）</h4>
        <InputNumber
          formatter={value => `${value}`.replace(/\D/g, '')}
          onChange={(...args) => console.log('inputNumber change', ...args)}
          onNumberChange={(...args) => console.log('inputNumber number change', ...args)}
        />
        <Form onValueChange={v => console.log(v)}>
          <h4>
            Form + Form.InputNumber + formatter + onChange（onChange包括英文字符，显示没有英文字符）
          </h4>
          <Form.InputNumber
            field="formOriginalInputNumber"
            noLabel
            formatter={value => `${value}`.replace(/\D/g, '')}
            onChange={(...args) => console.log('form inputNumber change', ...args)}
          />
          <h4>
            Form + withField InputNumber + formatter +
            onNumberChange（onNumberChange不包括英文字符，显示也不包括英文字符）
          </h4>
          <CustomInput
            field="formCustomInputNumber"
            noLabel
            formatter={value => `${value}`.replace(/\D/g, '')}
          />
        </Form>
        <h4>
          type=number （TODO：需要关注内置的按钮+不同浏览器对type=number的支持情况，比如 safari
          貌似就不支持）
        </h4>
        <InputNumber
          type="number"
          onChange={(...args) => console.log('inputNumber change', ...args)}
          onNumberChange={(...args) => console.log('inputNumber number change', ...args)}
        />
        <h4>测试 formatter + parser 是否正常</h4>
        <InputNumber
          onChange={v => console.log(`Changed to: [${typeof v}] ${v}`)}
          defaultValue={1000}
          min={0}
          formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\￥\s?|(,*)/g, '')}
        />
      </>
    );
  };
  return <Demo />;
};

FormCustomInput.story = {
  name: 'Form.CustomInput',
};


export const FixPrecision = () => {
  const [value, setValue] = useState(5.12);
  const [value2, setValue2] = useState(5.12);
  return (
    <div>
        <InputNumber onChange={v => setValue(v)} value={value} style={{ width: 190 }} precision={2} />
        <InputNumber keepFocus onBlur={() => console.log('blur')} onChange={v => setValue2(v)} value={value2} style={{ width: 190 }} precision={2} />
    </div>
  );
}

/**
 * 受控传超出 min value 的值，需要触发 onChange
 * 不然在 Form 中使用可能会导致 Form State 与 InputNumber 展示的值不同问题
 */
export const FixMinValue = () => {
  const [value, setValue] = useState();
  const formRef = useFormApi();
  return (
      <div style={{ width: 280 }}>
          <Button onClick={() => setValue(0)}>min=1, setValue=0</Button>
          <InputNumber
            min={1}
            value={value} 
            onChange={(v, e) => {
              console.log('inputNumber1 change', `'${v}'`, e);
              setValue(v);
            }} 
          />
          <InputNumber
            min={1}
            value={0} 
            onChange={(v, e) => {
              console.log('inputNumber2 change', v, e);
            }}
          />
          <Form initValues={{ minControlled: 0 }}>
            <Form.InputNumber
              field='minControlled'
              min={1}
              onChange={(v, e) => {
                console.log('form inputNumber change', v, e);
              }}
            />
          </Form>
          <Button onClick={() => formRef.current.setValue('minControlled', 0) }>set form value</Button>
          <Button onClick={() => { console.log('form value', JSON.stringify(formRef.current.getValues()))}}>get form values</Button>
      </div>
  );
}
FixMinValue.storyName = 'fix min value';

/**
 * fix InputNumber precision 删除后，输入非法字符显示 0.00
 * https://github.com/DouyinFE/semi-design/issues/786
 */
export const FixPrecision786 = () => {
  return (
    <div data-cy="fix-precision-786">
        <InputNumber defaultValue={10.00} precision={2} />
    </div>
  );
}
FixPrecision786.storyName = 'fix precision 删除后输入非法值会显示 0.00';


 export const FixFormValidate = () => {
  return (
      <div data-cy="fix-precision-786">
          <Form  >
              <Form.InputNumber
                  field="inputnumber"
                  label='inputnumber' 
                  rules={[
                      {
                          required: true,
                      },
                  ]}
              />
              <Form.Input
                  field="input"
                  label='input'
                  rules={[
                      {
                          required: true,
                      },
                  ]}
              />
          </Form>
      </div>
  );
}
FixFormValidate.storyName = 'fix form validate';

export const InputNumberA11y = () => {
  return (
    <Space vertical align="start" data-cy="a11y">
      <label for="default">
        step=1, shiftStep=10
      </label>
      <InputNumber id="default" data-cy="default" />
      <label for="step">
        step=5, shiftStep=100
      </label>
      <InputNumber id="step" data-cy="step" step={5} shiftStep={100} />
      <label for="max">
        step=1, shiftStep=10, max=10
      </label>
      <InputNumber id="max" data-cy="max" max={10} />
      <Form>
        <Form.InputNumber field="test" label="item number" />
      </Form>
    </Space>
  );
}
InputNumberA11y.storyName = "inputNumber a11y";

export const PrefixSuffix = () => {
  return (
    <InputNumber prefix="年龄" suffix='岁' />
  );
}

export const Fix1772 = () => {
  const [value, setValue] = useState(60000);
  return (
    <InputNumber
      formatter={value => {
        const formattedValue = String(Number(`${value}`.replace(/\D/g, '')) / 60000);
        console.log('format value', value, formattedValue);
        return formattedValue;
      }}
      parser={value => {
        const parsedValue = String(Number(`${value}`.replace(/\D/g, '')) * 60000);
        console.log('parser value', value, parsedValue);
        return parsedValue;
      }}
      value={value}
      onChange={value => {
        console.log('onChange', value);
        setValue(value)
      }}
      min={60000}
      step={60000}
    />
  );
}