/* eslint-disable */
import React, { useState } from 'react';
import { Checkbox,CheckboxGroup, Button, Typography, Space, Card, Spin } from '@douyinfe/semi-ui';
import { IconDownload, IconFolder } from '@douyinfe/semi-icons';
import JSZip from 'jszip';
import { FormattedMessage } from 'react-intl';
import './index.scss';

const { Text, Title } = Typography;

// 确认支持 skills 的工具及其路径
const skillsOptions = [
    {
        id: 'traue',
        path: '.trae/skills/',
    },
    {
        id: 'cursor',
        path: '.cursor/skills/',
    },
    {
        id: 'codebuddy',
        path: '.codebuddy/skills/',
    },
    {
        id: 'claudeCode',
        path: '.claude/skills/',
    },
    {
        id: 'qwenCode',
        path: '.qwen/skills/',
    },
    {
        id: 'openAICodex',
        path: '.codex/skills/',
    },
    {
        id: 'standard',
        path: '.skills/',
    },
];

const SkillsWriter = () => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    // 处理 checkbox 变化
    const handleCheckboxChange = (values) => {
        setSelectedSkills(values);
        setMessage(null);
    };

    // 递归创建目录
    const createDirectoryHandle = async (baseHandle, pathParts) => {
        let currentHandle = baseHandle;
        for (const part of pathParts) {
            try {
                currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
            } catch {
                currentHandle = await currentHandle.getDirectoryHandle(part);
            }
        }
        return currentHandle;
    };

    // 递归写入文件
    const writeFile = async (handle, filePath, content) => {
        const pathParts = filePath.split('/').filter(p => p);
        const fileName = pathParts.pop();
        const dirHandle = await createDirectoryHandle(handle, pathParts);
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    };

    // 下载并解压 skills.zip
    const downloadAndExtractSkills = async () => {
        if (selectedSkills.length === 0) {
            setMessage(<FormattedMessage id='skillsWriter.error.noSelection' />);
            setMessageType('error');
            return;
        }

        // 检查是否支持目录选择器
        if (!('showDirectoryPicker' in window)) {
            setMessage(<FormattedMessage id='skillsWriter.error.unsupportedBrowser' />);
            setMessageType('error');
            return;
        }

        try {
            // 1. 先让用户选择目录
            const handle = await window.showDirectoryPicker();
            
            // 2. 用户选择目录后开始处理
            setLoading(true);
            setMessage(null);

            // 3. 下载 skills.zip
            const response = await fetch('/skills.zip');
            if (!response.ok) {
                throw new Error(<FormattedMessage id='skillsWriter.error.downloadFailed' />);
            }
            const blob = await response.blob();

            // 4. 解压 zip 文件，把 semi-ui-skills 文件夹写入到用户选择的路径下
            const zip = await JSZip.loadAsync(blob);
            
            // 获取用户选择的路径列表
            const selectedPaths = selectedSkills.map(s => s.path);
            
            // 找到 zip 中的 semi-ui-skills 文件夹
            const skillsFolderEntry = Object.entries(zip.files).find(([path]) => 
                path === 'semi-ui-skills' || path.startsWith('semi-ui-skills/')
            );

            if (!skillsFolderEntry) {
                throw new Error(<FormattedMessage id='skillsWriter.error.zipNotFound' />);
            }

            // 对每个用户选择的路径，创建 semi-ui-skills 文件夹并写入内容
            let totalCount = 0;
            
            for (const selectedPath of selectedPaths) {
                // 在用户选择的路径下创建 semi-ui-skills 文件夹
                const skillsFolderName = 'semi-ui-skills';
                const normalizedPath = selectedPath.replace(/^\//, '').replace(/\/$/, '');
                const pathParts = normalizedPath.split('/');
                
                let currentHandle = handle;
                for (const part of pathParts) {
                    try {
                        currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
                    } catch {
                        currentHandle = await currentHandle.getDirectoryHandle(part);
                    }
                }

                // 创建 semi-ui-skills 文件夹
                let skillsHandle;
                try {
                    skillsHandle = await currentHandle.getDirectoryHandle(skillsFolderName, { create: true });
                } catch {
                    skillsHandle = await currentHandle.getDirectoryHandle(skillsFolderName);
                }

                // 遍历 zip 中 semi-ui-skills 文件夹下的所有文件
                for (const [filePath, zipEntry] of Object.entries(zip.files)) {
                    if (filePath.startsWith('semi-ui-skills/')) {
                        const relativePath = filePath.replace('semi-ui-skills/', '');
                        
                        if (!zipEntry.dir && relativePath) {
                            // 写入文件
                            const content = await zipEntry.async('uint8array');
                            await writeFile(skillsHandle, relativePath, content);
                            totalCount++;
                        }
                    }
                }
            }

            setMessage(<FormattedMessage id='skillsWriter.success.addedFiles' values={{ count: totalCount }} />);
            setMessageType('success');
        } catch (err) {
            if (err.name === 'AbortError') {
                // 用户取消选择，不显示任何消息
            } else {
                console.error('添加到项目失败:', err);
                setMessage(<FormattedMessage id='skillsWriter.error.addFailed' values={{ message: err.message }} />);
                setMessageType('error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="skills-writer">
            <Card className="skills-writer-card">
                <div className="skills-writer-header">
                    <IconDownload size="large" style={{ color: 'var(--semi-color-link)' }} />
                    <Title level={5} style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                        <FormattedMessage id='skillsWriter.title' />
                    </Title>
                </div>
                
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    <FormattedMessage id='skillsWriter.subtitle' />
                </Text>

                <CheckboxGroup
                    onChange={handleCheckboxChange}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8}}
                >
                    {skillsOptions.map((option, index) => (
                        <Checkbox key={index} value={option} style={{ alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <Space>
                                    <Text strong>
                                        <FormattedMessage id={`skillsOption.${option.id}.label`} />
                                    </Text>
                                    <Text type="quaternary" style={{ fontSize: 12 }}>
                                        ({option.path})
                                    </Text>
                                </Space>
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 2 }}>
                                    <FormattedMessage id={`skillsOption.${option.id}.description`} />
                                </Text>
                            </div>
                        </Checkbox>
                    ))}
                </CheckboxGroup>

                {message && !loading && (
                    <Text type={messageType === 'error' ? 'danger' : messageType === 'success' ? 'success' : 'secondary'} style={{ display: 'block', marginBottom: 12 }}>
                        {message}
                    </Text>
                )}

                <div className="skills-writer-actions">
                    <Space>
                        <Button
                            type="primary"
                            icon={<IconFolder />}
                            onClick={downloadAndExtractSkills}
                            loading={loading}
                            disabled={selectedSkills.length === 0}
                        >
                            <FormattedMessage id='skillsWriter.button' />
                        </Button>
                        {!loading && (
                            <Text type="tertiary" style={{ fontSize: 12 }}>
                                <FormattedMessage id='skillsWriter.permissionHint' />
                            </Text>
                        )}
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default SkillsWriter;
