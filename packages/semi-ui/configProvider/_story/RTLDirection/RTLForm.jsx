/* eslint-disable max-len */

/* eslint-disable max-lines-per-function */
import React from 'react';
import { Form, Row, Col, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

class RTLForm extends React.Component {
    constructor() {
        super();
        this.state = {
            initValues: {
                name: 'semi',
                business: ['hotsoon'],
                role: 'ued',
                switch: true,
                files: [
                    {
                        uid: '1',
                        name: 'vigo.png',
                        status: 'success',
                        size: '130KB',
                        preview: true,
                        url:
                            'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/vigo.png',
                    },
                    {
                        uid: '3',
                        name: 'jiafang.jpeg',
                        status: 'uploading',
                        size: '222KB',
                        percent: 50,
                        preview: true,
                        fileInstance: new File([new ArrayBuffer(2048)], 'jiafang.jpeg', {
                            type: 'image/jpeg',
                        }),
                        url:
                            'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
                    },
                ],
            },
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        const {
            Section,
            Input,
            InputNumber,
            Select,
            DatePicker,
            TimePicker,
            TextArea,
            CheckboxGroup,
            Checkbox,
            RadioGroup,
            Radio,
            Slider,
            Rating,
            Switch,
        } = Form;
        const { initValues } = this.state;
        const style = {
            width: '90%',
        };
        const treeData = [
            {
                label: '??????',
                value: 'Asia',
                key: '0',
                children: [
                    {
                        label: '??????',
                        value: 'China',
                        key: '0-0',
                        children: [
                            {
                                label: '??????',
                                value: 'Beijing',
                                key: '0-0-0',
                            },
                            {
                                label: '??????',
                                value: 'Shanghai',
                                key: '0-0-1',
                            },
                        ],
                    },
                ],
            },
            {
                label: '?????????',
                value: 'North America',
                key: '1',
            },
        ];
        return (
            <div
                style={{
                    width: 1200,
                }}
            >
                <Form
                    getFormApi={this.getFormApi}
                    initValues={initValues}
                    style={{
                        padding: 10,
                        width: '100%',
                    }}
                    onValueChange={v => console.log(v)}
                >
                    <Section text={'????????????'}>
                        <Row>
                            <Col span={12}>
                                <Input
                                    field="name"
                                    label="?????????Input???"
                                    initValue={'mikeya'}
                                    style={style}
                                    trigger="blur"
                                />
                            </Col>
                            <Col span={12}>
                                <DatePicker
                                    field="date"
                                    label="?????????DatePicker???"
                                    style={style}
                                    initValue={new Date()}
                                    placeholder="?????????????????????"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Select field="role" style={style} label="?????????Select???" placeholder="?????????????????????">
                                    <Select.Option value="operate">??????</Select.Option>
                                    <Select.Option value="rd">??????</Select.Option>
                                    <Select.Option value="pm">??????</Select.Option>
                                    <Select.Option value="ued">??????</Select.Option>
                                </Select>
                            </Col>
                            <Col span={12}>
                                <Select
                                    field="business"
                                    multiple
                                    style={style}
                                    placeholder="??????????????????"
                                    label="??????????????????Select???"
                                    extraText={(
                                        <div
                                            style={{
                                                color: 'rgba(var(--semi-blue-5), 1)',
                                                fontSize: 14,
                                                userSelect: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            ?????????????????????????????????
                                        </div>
                                    )}
                                >
                                    <Select.Option value="dy">??????</Select.Option>
                                    <Select.Option value="hotsoon">???????????????</Select.Option>
                                    <Select.Option value="toutiao">????????????</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Cascader
                                    placeholder="?????????????????????"
                                    treeData={treeData}
                                    field="area"
                                    label="?????????Cascader???"
                                    style={style}
                                />
                            </Col>
                            <Col span={12}>
                                <Form.TreeSelect
                                    field="tree"
                                    style={style}
                                    label="?????????TreeSelect???"
                                    placeholder="?????????????????????"
                                    treeData={treeData}
                                    filterTreeNode
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Upload
                                    field="files"
                                    label="???????????????Upload???"
                                    action="//semi.design/api/upload"
                                >
                                    <Button icon={<IconUpload />} theme="light">
                                        ????????????
                                    </Button>
                                </Form.Upload>
                            </Col>
                        </Row>
                    </Section>
                    <Section text="????????????">
                        <Row>
                            <Col span={12}>
                                <TextArea
                                    style={{ ...style, height: 120 }}
                                    field="description"
                                    label="???????????????TextArea???"
                                    placeholder="???????????????????????????"
                                />
                            </Col>
                            <Col span={12}>
                                <CheckboxGroup
                                    field="type"
                                    direction="horizontal"
                                    label="???????????????CheckboxGroup???"
                                    initValue={['user', 'admin']}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Checkbox value="admin">admin</Checkbox>
                                    <Checkbox value="user">user</Checkbox>
                                    <Checkbox value="guest">guest</Checkbox>
                                    <Checkbox value="root">root</Checkbox>
                                </CheckboxGroup>
                                <RadioGroup
                                    field="isMonopolize"
                                    label="?????????????????????Radio???"
                                    rules={[
                                        {
                                            type: 'boolean',
                                        },
                                        {
                                            required: true,
                                            message: '???????????????????????? ',
                                        },
                                    ]}
                                >
                                    <Radio value={true}>???</Radio>
                                    <Radio value={false}>???</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <TimePicker
                                    field="time"
                                    label="???????????????TimePicker???"
                                    style={{
                                        width: '90%',
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <InputNumber
                                    field="number"
                                    label="???????????????InputNumber???"
                                    initValue={20}
                                    style={style}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Slider
                                    field="range"
                                    label="????????????????????????(%)???Slider???"
                                    initValue={10}
                                    style={{
                                        width: '90%',
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <Switch field="switch" label="??????(Switch)" />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Rating
                                    field="rating"
                                    label="?????????(Rating)"
                                    initValue={2}
                                    style={{
                                        width: '90%',
                                    }}
                                />
                            </Col>
                        </Row>
                    </Section>
                    <Checkbox value="false" field="agree" noLabel={true}>
                        ????????????????????????????????????Checkbox???
                    </Checkbox>
                    <Button type="primary" htmlType="submit" className="btn-margin-right">
                        ??????(submit)
                    </Button>
                    <Button htmlType="reset">??????(reset)</Button>
                </Form>
            </div>
        );
    }
}

export default RTLForm;
