import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Select, Modal, Button, Tooltip, Popover } from '../../index';
import CollapsibleInModal from './CollapsibleInModal';
import DynamicContextDemo from './DynamicContext';

const stories = storiesOf('Modal', module);

const Option = Select.Option;

const DialogComponent = props => {
    const [visible, setVisible] = useState(false);

    const handleOk = e => {
        setVisible(false);
    };

    const handleCancel = e => {
        setVisible(false);
    };

    return (
        <React.Fragment>
            <Button onClick={() => setVisible(true)}>show dialog</Button>
            <Modal title="对话框标题" visible={visible} onOk={handleOk} onCancel={handleCancel} {...props}>
                <input autoFocus />
                <p>basic modal</p>
                <Button onClick={handleCancel}>hide dialog</Button>
            </Modal>
        </React.Fragment>
    );
};

stories.add('模态框默认', () => <DialogComponent />);

stories.add('模态框-点击遮罩层不可关闭', () => <DialogComponent maskClosable={false} />);

function useLoading() {
    const [loading, setLoading] = useState(false);
    function startQuery() {
        setLoading(true);
    }
    return [loading, { startQuery }];
}

function DialogComponentWithLoading() {
    const [loading, actions] = useLoading();
    return <DialogComponent confirmLoading={loading} onOk={actions.startQuery} />;
}

// button 组件的 loading ui还没有实现
stories.add('模态框-点击确认按钮展现loading, button组件的loading没有实现，所以现在还没有', () => (
    <DialogComponentWithLoading />
));

function success() {
    Modal.success('bla bla bla...');
}

function info() {
    Modal.info('info');
}

function error() {
    Modal.error({ title: 'Unfortunately, there is an error', content: 'bla bla bla...' });
}

function warning() {
    Modal.warning({ title: 'Warning: be cautious ahead', content: 'bla bla bla...' });
}

function confirm() {
    Modal.confirm({ title: 'Are you sure ?', content: 'bla bla bla...' });
}

stories.add('命令式调用', () => (
    <div>
        <Button onClick={info}>Info</Button>
        <Button onClick={success}>Success</Button>
        <Button onClick={error}>Error</Button>
        <Button onClick={warning}>Warning</Button>
        <Button onClick={confirm}>Confirm</Button>
    </div>
));

const Test = () => {
    let modal;

    const showModal = () => {
        modal = Modal.info({
            title: '修改的标题',
            content: (
                <>
                    <Button onClick={() => modal && modal.destroy()}>close</Button>
                    <Button onClick={() => modal && modal.update({ title: 'lalala updating' })}>update</Button>
                </>
            ),
        });
    };

    return <Button onClick={() => showModal()}>Info</Button>;
};

stories.add('modal.destroy', () => <Test />);

const ScrollComponent = props => {
    const [visible, setVisible] = useState(true);

    const handleOk = e => {
        setVisible(false);
    };

    const handleCancel = e => {
        setVisible(false);
    };

    return (
        <div style={{ paddingTop: 900, paddingBotttom: 800 }}>
            <Button onClick={() => setVisible(true)}>show dialog</Button>
            <Modal
                id="modal-test"
                title="对话框标题"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                {...props}
            >
                <Select>
                    <Option value={1}>opt1</Option>
                    <Option value={2}>opt2</Option>
                    <Option value={3}>opt3</Option>
                    <Option value={4}>opt4</Option>
                    <Option value={5}>opt5</Option>
                    <Option value={6}>opt6</Option>
                </Select>
                <Tooltip content="fefefefeef">test tooltip in modal</Tooltip>
                <Button onClick={handleCancel}>hide dialog</Button>
                <Popover content={'1,2,3'}>
                    <Button>hover</Button>
                </Popover>
            </Modal>
            <Select>
                <Option value={1}>opt1</Option>
                <Option value={2}>opt2</Option>
                <Option value={3}>opt3</Option>
                <Option value={4}>opt4</Option>
                <Option value={5}>opt5</Option>
                <Option value={6}>opt6</Option>
            </Select>
        </div>
    );
};

stories.add('滚动', () => <ScrollComponent />);

const Popup = () => {
    const [visible, setVisible] = useState(false);
    const getContainer = () => {
        return document.querySelector('.modal-container');
    };
    return (
        <div
            style={{
                height: 320,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--semi-color-border)',
                borderRadius: 2,
                padding: 24,
                textAlign: 'center',
                background: 'var(--semi-color-fill-0)',
            }}
            className="modal-container"
        >
            <span>Render in this</span>
            <br />
            <br />
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <Modal
                title="渲染在指定容器内部"
                visible={visible}
                onCancel={() => setVisible(false)}
                width={200}
                // centered
                // style={{ top: '10px' }}
                getPopupContainer={getContainer}
            >
                <p>This is the content of a basic sidesheet.</p>
                <p>Here is more content...</p>
            </Modal>
        </div>
    );
};

stories.add('渲染在指定容器内部', () => <Popup />);

stories.add(`dynamic context demo`, () => <DynamicContextDemo />);
stories.add(`collapsible in modal`, () => <CollapsibleInModal />);

stories.add('keepDOM', () => <DialogComponent keepDOM />);

stories.add('keepDOM && not lazy', () => <DialogComponent keepDOM lazyRender={false} />);
