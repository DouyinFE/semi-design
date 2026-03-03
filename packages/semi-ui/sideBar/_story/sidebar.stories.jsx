import React, { useState, useRef, useEffect, useCallback } from 'react';
import Container from '../container';
import { Button, Modal, Form, Collapse } from '../../index';
import MCPConfigureContent from '../mcpConfigure/content';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';
import MCPConfigure from '../mcpConfigure';
import AnnotationContent from '../annotation/content';
import { defaultOptions, defaultInfoList, containerStyle, optionList, defaultFileContent, defaultFiles, defaultCodes, imgUploadProps } from './constant';
import Annotation from '../annotation';
import Option from '../options';
import CodeContent from '../widget/code';
import  FileContent, { FileItem } from '../widget/file';
import Sidebar from '../index';

export default {
  title: 'Sidebar',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export const ContainerDemo = () => {
    const [visible, setVisible] = useState(false);
    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, [])
    return <div style={containerStyle}>
        <div style={{ flexGrow: 1,  flexShrink: 1 }}>
            <Button onClick={toggleVisible}>点我 {visible ? 'hide' : 'show' }</Button>
        </div>
        <Container
            motion={true}
            resizable={true}
            minWidth={250}
            maxWidth={'60%'}
            visible={visible}
            title={"基础容器示例"}
            onCancel={toggleVisible}
        >   
        </Container>
    </div>
}

const CustomOptionCreateModel = (props) => {
    const { visible, handleOk, handleCancel, formRef } = props;

    return (<Modal
        title="自定义 MCP"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeOnEsc={true}
    >
        <Form
            ref={formRef} 
            layout='vertical' 
            onValueChange={values=>console.log(values)}
        >
            <Form.Input 
                rules={[{ required: true, message: '请输入MCP名称' }]} 
                field='name' 
                label='MCP 名称' 
                style={{ width: '100%' }}
            />
            {/* https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png */}
            <Form.Input 
                initValue={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png'}
                rules={[
                    { required: true, message: '请输入MCP 图标 URL'},
                    { 
                        validator: (rule, value) => {
                            const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\:\d+)?(?:\/[^\s]*)?$/i;
                            return urlRegex.test(value);
                        },
                        message: '请输入有效的MCP 图标 URL'
                    }
                ]} 
                field='src' 
                label='MCP 图标 URL' 
                style={{ width: '100%' }}
                
            />
            <Form.TextArea 
                rules={[{ required: true, message: '请输入 MCP 介绍' }]} 
                field='desc' 
                label="MCP 介绍" 
                style={{ width: '100%' }}
            />
        </Form>
    </Modal>);
}

export const MCPConfigureContentDemo = (props) => {
    const [options, setOptions] = useState(defaultOptions);
    const [visible, setVisible] = useState(false);
    const [customOptions, setCustomOptions] = useState([]);
    const formRef = useRef(null);

    const showDialog = useCallback(() => {
        setVisible(true);
    }, []);

    const handleOk = useCallback(() => {
        formRef.current.formApi.validate().then(values => {
            const newOptions = [...customOptions, {
                label: values.name,
                icon: values.src,
                value: getUuidShort({ prefix: 'mcp' }),
                desc: values.desc
            }];
            console.log('newOptions', newOptions);
            setCustomOptions(newOptions);
            setVisible(false);
        }).catch(errors => {
            console.log('errors', errors);
        });
    }, []);

    const handleCancel = useCallback(() => {
        setVisible(false);
        console.log('Cancel button clicked');
    }, []);

    const onStatusChange = useCallback((options, custom) => {
        if (custom) {
            setCustomOptions(options);
        } else {
            setOptions(options);
        }
    }, []);
    
    const onAddClick = useCallback((e) => {
        showDialog();
        console.log('add click', e);
    }, []);

    const onConfigureClick = useCallback((e, option) => {
        console.log('configure click', option);
    }, []);

    const onEditClick = useCallback((e, option) => {
        console.log('edit click', option);
    }, []);

    return (<>
        <MCPConfigureContent
            style={props.style ? props.style : { width: 600, height: 500, border: '1px solid var(--semi-color-border)', borderRadius: 8 }}
            options={options}
            customOptions={customOptions}
            onStatusChange={onStatusChange}
            onAddClick={onAddClick}
            onConfigureClick={onConfigureClick}
            onEditClick={onEditClick}
        />
        <CustomOptionCreateModel
            formRef={formRef}
            visible={visible}
            handleOk={handleOk}
            handleCancel={handleCancel}
        />
    </>);
}

export const MCPConfigureDemo = () => {
    const [visible, setVisible] = useState(false);
    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, [])
    const [options, setOptions] = useState(defaultOptions);
    const [mVisible, setMVisible] = useState(false);
    const [customOptions, setCustomOptions] = useState([]);
    const formRef = useRef(null);

    const handleOk = useCallback(() => {
        formRef.current.formApi.validate().then(values => {
            const newOptions = [...customOptions, {
                label: values.name,
                icon: values.src,
                value: getUuidShort({ prefix: 'mcp' }),
                desc: values.desc
            }];
            console.log('newOptions', newOptions);
            setCustomOptions(newOptions);
            setMVisible(false);
        }).catch(errors => {
            console.log('errors', errors);
        });
    }, []);

    const showDialog = useCallback(() => {
        setMVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setMVisible(false);
        console.log('Cancel button clicked');
    }, []);

    const onStatusChange = useCallback((options, custom) => {
        if (custom) {
            setCustomOptions(options);
        } else {
            setOptions(options);
        }
    }, []);

    const onAddClick = useCallback((e) => {
        showDialog();
        console.log('add click', e);
    }, []);

    const onConfigureClick = useCallback((e, option) => {
        console.log('configure click', option);
    }, []);

    const onEditClick = useCallback((e, option) => {
        console.log('edit click', option);
    }, []);

    return <div style={containerStyle}>
        <div style={{ flexGrow: 1,  flexShrink: 1 }}>
            <Button onClick={toggleVisible}>点我 {visible ? 'hide' : 'show' }</Button>
        </div>
        <MCPConfigure
            style={{width: 600}}
            resizable={false}
            visible={visible}
            onCancel={toggleVisible}
            options={options}
            customOptions={customOptions}
            onStatusChange={onStatusChange}
            onAddClick={onAddClick}
            onConfigureClick={onConfigureClick}
            onEditClick={onEditClick}
        />
        <CustomOptionCreateModel
            formRef={formRef}
            visible={mVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
        />
    </div>
}

export const collapse = () => {
    return <Collapse style={{ width: 400, padding: 16 }} className="semi-sidebar-collapse">
        <Collapse.Panel header="This is panel header 1" itemKey="1" >
            <p>Hi, byteDance dance dance. This is the docSite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 2" itemKey="2" >
            <p>Hi, byteDance dance dance. This is the docSite of Semi UI. </p>
        </Collapse.Panel>
        <Collapse.Panel header="This is panel header 3" itemKey="3" >
            <p>Hi, byteDance dance dance. This is the docSite of Semi UI. </p>
        </Collapse.Panel>
    </Collapse>
}

export const AnnotationContentDemo = () => {
    const [activeKey, setActiveKey] = useState('1');

    const onChange = useCallback((key) => {
        console.log('onChange', key);
        setActiveKey(key);
    }, []);

    const onClick = useCallback((e, item) => {
        console.log('onClick', e, item);
    }, []);

    return <AnnotationContent
        style={{ width: 400 }}
        activeKey={activeKey}
        info={defaultInfoList}
        onChange={onChange}
        onClick={onClick}
    />
}

export const AnnotationDemo = () => {
    const [visible, setVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('1');

    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, []);

    const onChange = useCallback((key) => {
        console.log('onChange', key);
        setActiveKey(key);
    }, []);

    const onClick = useCallback((e, item) => {
        console.log('onClick', e, item);
    }, []);

    return <div style={containerStyle}>
        <div style={{ flexGrow: 1, flexShrink: 1 }}>
            <div>参考来源 demo</div>
            <Button onClick={toggleVisible}>点我 {visible ? 'hide' : 'show' }</Button>
        </div>
        <Annotation
            visible={visible}
            onCancel={toggleVisible}
            activeKey={activeKey}
            defaultSize={{ width: 400 }}
            info={defaultInfoList}
            onChange={onChange}
            onClick={onClick}
        />
    </div>;
}

export const OptionDemo = () => {
    const [activeKey, setActiveKey] = useState('searchResult');
    const onChange = useCallback((option) => {
        setActiveKey(option.key);
    }, []);
 
    return <Option
        activeKey={activeKey}
        options={optionList}
        // renderOptionItem={renderOptionItem}
        onChange={onChange}
    />
}

export const CodeContentDemo = () => {
    const [activeKey, setActiveKey] = useState('code1');

    const onChange = useCallback((key) => {
        setActiveKey(key);
    }, []);

    return <div className='semi-sidebar-main'>
         <CodeContent
            style={{ width: 400 }}
            activeKey={activeKey}
            codes={defaultCodes}
            onChange={onChange}
        />
    </div>
    
}

export const SideBarDemo = () => {
    const [mode, setMode] = useState('main')
    const [activeKey, setActiveKey] = useState('codePreview');
    const [activeCodeKey, setActiveCodeKey] = useState('code1');
    const [activeFileKey, setActiveFileKey] = useState('file1');
    const [activeReferKey, setActiveReferKey] = useState('2');
    const [visible, setVisible] = useState(false);
    const [currentDetail, setCurrentDetail] = useState();
    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, []);

    const onExpand = useCallback((e, content, mode) => {
        setMode(mode);
        setCurrentDetail(content);
    }, []);

    const onActiveCodeKeyChange = useCallback((codeKey) => {
        setActiveCodeKey(codeKey);
    }, []);

    const onActiveFileKeyChange = useCallback((fileKey) => {
        setActiveFileKey(fileKey);
    }, []);

    const onActiveReferKeyChange = useCallback((referKey) => {
        setActiveReferKey(referKey);
    }, []);

    const renderMainContent = useCallback((activeKey) => {
        switch (activeKey) {
            case 'searchResult':
                return <AnnotationContent
                    activeKey={activeReferKey}
                    info={defaultInfoList}
                    onChange={onActiveReferKeyChange}
                />;
            case 'filePreview':
                return <FileContent
                    activeKey={activeFileKey}
                    files={defaultFiles}
                    onExpand={onExpand}
                    onChange={onActiveFileKeyChange}
                />;
            case 'codePreview':
                return <CodeContent
                    activeKey={activeCodeKey}
                    codes={defaultCodes}
                    onExpand={onExpand}
                    onChange={onActiveCodeKeyChange}
                />;
            case 'network':
                return <img     
                    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/test.jpg"
                    style={{ width: '100%' }}
                />;
            default:
                return;
        } 
    }, [activeCodeKey, activeFileKey, activeReferKey]);

    const renderDetailContent = useCallback((mode) => {
        switch (mode) {
            default:
                return;
        }
    }, []);

    // const renderDetailHeader = useCallback((mode) => {
    //     switch (mode) {
    //         case 'main':
    //             return ;
    //         case 'code': 
    //             return <div>code detail</div>;
    //         case 'file': 
    //             return <div>file detail</div>;
    //     }
    // }, []);
    
    const onActiveOptionChange = useCallback((e, key) => {
        setActiveKey(key);
    }, []);

    const onBackWard = useCallback((e, mode) => {
        setMode(mode);
    }, []);

    return <div style={containerStyle}>
       <div style={{ flexGrow: 1,  flexShrink: 1 }}>工作区</div>
        <Sidebar
            resizable={true}
            visible={true}
            motion={false}
            mode={mode}
            defaultSize={{width: 600}}
            title="Agent 的工作空间"
            // renderDetailHeader={renderDetailHeader}
            onActiveOptionChange={onActiveOptionChange}
            activeKey={activeKey}
            options={optionList}
            onBackWard={onBackWard}
            renderMainContent={renderMainContent}
            renderDetailContent={renderDetailContent}
            onExpand={onExpand}
            detailContent={currentDetail}
            imgUploadProps={imgUploadProps}
        />
    </div>
}

export const FileDemo = () => {
    const [editable, setEditable] = useState(true);
    const [content, setContent] = useState(defaultFileContent);
    const toggleEditable = useCallback(() => {
        setEditable(editable => !editable);
    }, []);
    return <>
        <Button onClick={toggleEditable}>Editable: {editable ? 'true' : 'false'}</Button>
        <br /><br />
        <FileItem
            content={content}
            onContentChange={setContent}
            editable={editable}
            style={{ border: '1px solid var(--semi-color-border)', padding: 12 }}
            imgUploadProps={imgUploadProps}
        />
    </>
}

