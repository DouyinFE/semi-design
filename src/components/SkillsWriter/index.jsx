/* eslint-disable */
import React, { useState } from 'react';
import { Checkbox,CheckboxGroup, Button, Typography, Space, Card, Spin } from '@douyinfe/semi-ui';
import { IconDownload, IconFolder } from '@douyinfe/semi-icons';
import JSZip from 'jszip';
import './index.scss';

const { Text, Title } = Typography;

// 确认支持 skills 的工具及其路径
const skillsOptions = [
    {
        label: 'Trae',
        path: '.trae/skills/',
        description: '字节跳动 AI 原生编程 IDE，支持 Skills'
    },
    {
        label: 'Cursor',
        path: '.cursor/skills/',
        description: 'AI 增强代码编辑器，支持 Skills（需开启 Nightly 渠道）'
    },
    {
        label: 'CodeBuddy (腾讯云)',
        path: '.codebuddy/skills/',
        description: '腾讯云 AI 编程助手，支持 Skills'
    },
    {
        label: 'Claude Code',
        path: '.claude/skills/',
        description: 'Anthropic 官方 AI 编程助手，支持 Skills'
    },
    {
        label: 'Qwen Code (通义千问)',
        path: '.qwen/skills/',
        description: '阿里巴巴 AI 编程助手，支持 Skills'
    },
    {
        label: 'OpenAI Codex CLI',
        path: '.codex/skills/',
        description: 'OpenAI 官方 CLI 工具，支持 Skills'
    },
    {
        label: '通用标准 (.skills/)',
        path: '.skills/',
        description: '通用 Skills 目录标准（部分工具支持）'
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
            setMessage('请至少选择一个编程工具');
            setMessageType('error');
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            // 2. 下载 skills.zip
            const response = await fetch('/skills.zip');
            if (!response.ok) {
                throw new Error('下载 skills.zip 失败');
            }
            const blob = await response.blob();

            // 3. 使用浏览器 File System Access API 选择目标目录
            if ('showDirectoryPicker' in window) {
                try {
                    const handle = await window.showDirectoryPicker();

                    // 4. 解压 zip 文件，把 semi-ui-skills 文件夹写入到用户选择的路径下
                    const zip = await JSZip.loadAsync(blob);
                    
                    // 获取用户选择的路径列表
                    const selectedPaths = selectedSkills.map(s => s.path);
                    
                    // 找到 zip 中的 semi-ui-skills 文件夹
                    const skillsFolderEntry = Object.entries(zip.files).find(([path]) => 
                        path === 'semi-ui-skills' || path.startsWith('semi-ui-skills/')
                    );

                    if (!skillsFolderEntry) {
                        throw new Error('zip 文件中未找到 semi-ui-skills 文件夹');
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

                    setMessage(`成功添加 ${totalCount} 个文件到项目`);
                    setMessageType('success');
                } catch (err) {
                    if (err.name === 'AbortError') {
                        setMessage('已取消选择目录');
                        setMessageType('info');
                    } else {
                        throw err;
                    }
                }
            } else {
                setMessage('您的浏览器不支持目录选择功能，请使用最新版本的 Chrome 或 Edge 浏览器');
                setMessageType('error');
                console.log('选择的 skills 路径:', selectedSkills.map(s => s.path));
            }
        } catch (error) {
            console.error('添加到项目失败:', error);
            setMessage(`添加到项目失败: ${error.message}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="skills-writer">
            <Card className="skills-writer-card">
                <div className="skills-writer-header">
                    <IconDownload size="large" style={{ color: 'var(--semi-color-link)' }} />
                    <Title level={4} style={{ margin: '0 0 16px 0' }}>添加到我的项目</Title>
                </div>
                
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    选择要将 Skills 添加到的编程工具：
                </Text>

                <CheckboxGroup
                    onChange={handleCheckboxChange}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    {skillsOptions.map((option, index) => (
                        <Checkbox key={index} value={option}>
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
                                <Space>
                                    <Text strong>{option.label}</Text>
                                    <Text type="quaternary" style={{ fontSize: 12 }}>
                                        ({option.path})
                                    </Text>
                                </Space>
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 2 }}>
                                    {option.description}
                                </Text>
                            </div>
                        </Checkbox>
                    ))}
                </CheckboxGroup>

                {message && (
                    <Text type={messageType === 'error' ? 'danger' : messageType === 'success' ? 'success' : 'secondary'} style={{ display: 'block', marginBottom: 12 }}>
                        {message}
                    </Text>
                )}

                <div className="skills-writer-actions">
                    <Button
                        type="primary"
                        icon={<IconFolder />}
                        onClick={downloadAndExtractSkills}
                        loading={loading}
                        disabled={selectedSkills.length === 0}
                    >
                        添加到我的项目
                    </Button>
                </div>

                {loading && (
                    <div className="skills-writer-loading">
                        <Spin size="small" style={{ marginRight: 8 }} />
                        <Text type="secondary">正在处理...</Text>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SkillsWriter;
