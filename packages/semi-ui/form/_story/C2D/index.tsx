import React from 'react';

import { Form, Input, Select, Space } from '../../../index';

FormLabel.storyName = 'c2d-formLabel';
export function FormLabel() {
    return (
        <div>
            <Space vertical align="start">
                <Form.Label>名称（Input）</Form.Label>
                <Form.Label required>名称（Input）</Form.Label>
                <Form.Label optional>名称（Input）</Form.Label>
            </Space>
        </div>
    );
}

FormErrorMessage.storyName = 'c2d-formErrorMessage';
export function FormErrorMessage() {
    return (
        <div>
            <Space vertical align="start">
                <Form.ErrorMessage error="仅支持小写英文字母、数字及下划线" />
                <Form.ErrorMessage showValidateIcon validateStatus="error" error="仅支持小写英文字母、数字及下划线" />
                <Space>
                    <Form.ErrorMessage showValidateIcon error="提示文案" />
                    <Form.ErrorMessage showValidateIcon error="提示文案" />
                    <Form.ErrorMessage showValidateIcon error="提示文案" validateStatus="warning" />
                    <Form.ErrorMessage showValidateIcon error="提示文案" validateStatus="error" />
                </Space>
            </Space>
        </div>
    );
}

FormExtraText.storyName = 'c2d-extraText';
export function FormExtraText() {
    return (
        <div>
            <Space vertical align="start">
                <Form labelPosition="left">
                    <Form.Input
                        extraText="extra text"
                        field="phone"
                        label="PhoneNumber"
                        placeholder="Enter your phone number"
                    ></Form.Input>
                </Form>
            </Space>
        </div>
    );
}

FormField.storyName = 'c2d-formField';
export function FormField() {
    return (
        <Space vertical align="start">
            <Form labelPosition="left">
                <Form.Input
                    required
                    trigger="blur"
                    rules={[{ required: true, message: 'required error' }]}
                    field="phone"
                    label="电话"
                    placeholder="输入手机号"
                    validateStatus="error"
                ></Form.Input>
            </Form>
            <Form labelPosition="left">
                <Form.Select field="city" label="地址" placeholder="选择城市"></Form.Select>
            </Form>
        </Space>
    );
}

FormLabelPosition.storyName = 'c2d-formLabelPosition';
export function FormLabelPosition() {
    return (
        <div>
            <div>
                <h4>left</h4>
                <Form labelPosition="left">
                    <Form.Input field="phone" label="PhoneNumber" placeholder="Enter your phone number"></Form.Input>
                </Form>
            </div>
            <div>
                <h4>top</h4>
                <Form labelPosition="top">
                    <Form.Input field="phone" label="PhoneNumber" placeholder="Enter your phone number"></Form.Input>
                </Form>
            </div>
        </div>
    );
}

FormSection.storyName = 'c2d-formSection';
export function FormSection() {
    return (
        <div>
            <Form.Section text="Section 标题"></Form.Section>
        </div>
    );
}

FormLayout.storyName = 'c2d-formLayout';
export function FormLayout() {
    return (
        <div>
            <div>
                <h4>垂直（默认）</h4>
                <Form layout="vertical">
                    <Form.Input field="phone" label="PhoneNumber" placeholder="Enter your phone number"></Form.Input>
                </Form>
            </div>
            <div>
                <h4>水平</h4>
                <Form layout="horizontal">
                    <Form.Input field="phone" label="PhoneNumber" placeholder="Enter your phone number"></Form.Input>
                    <Form.Input field="password" label="Password" placeholder="Enter your password"></Form.Input>
                </Form>
            </div>
        </div>
    );
}
