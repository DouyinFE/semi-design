import React, { useCallback, useState } from 'react';
import { Sidebar } from '../../index';
import { storiesOf } from '@storybook/react';
import AnnotationContent from '../annotation/content';
import CodeContent from '../widget/code';
import { defaultOptions, defaultInfoList, containerStyle, optionList, defaultFileContent, defaultFiles, defaultCodes, imgUploadProps } from './constant';
import  FileContent, { FileItem } from '../widget/file';

const stories = storiesOf('Sidebar', module);

stories.add('default', () => {
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

    const onExpand = useCallback((e, content) => {
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
                    info={defaultInfoList as any}
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


    const renderDetailHeader = useCallback((mode) => {
        switch (mode) {
            case 'code': 
                return <div>code detail</div>;
            case 'file': 
                return <div>file detail</div>;
            default: 
                return null;
        }
    }, []);
    
    const onActiveOptionChange = useCallback((e, key) => {
        setActiveKey(key);
    }, []);

    const onBackWard = useCallback((e, mode) => {
        setMode(mode);
    }, []);

    return <div style={containerStyle as any}>
       <div style={{ flexGrow: 1,  flexShrink: 1 }}>工作区</div>
        <Sidebar
            visible={true}
            motion={false}
            mode={mode}
            style={{ width: '60%' }}
            renderDetailHeader={renderDetailHeader}
            onActiveOptionChange={onActiveOptionChange}
            activeKey={activeKey}
            options={optionList}
            onBackWard={onBackWard}
            renderMainContent={renderMainContent}
            detailContent={currentDetail}
        />
    </div>
});