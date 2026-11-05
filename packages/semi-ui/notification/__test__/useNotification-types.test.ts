import path from 'node:path';
import ts from 'typescript';

it('types the destructured notification API and context holder independently', () => {
    const packageRoot = path.resolve(__dirname, '../..');
    const configPath = path.join(packageRoot, 'tsconfig.json');
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, packageRoot);
    const fileName = path.join(__dirname, 'notification-usage.tsx');
    const source = `import React from 'react';
        import Notification from '../index';
        export default function Example() {
            const [notification, contextHolder] = Notification.useNotification();
            const open = () => {
                const id: string = notification.info({ title: '通知' });
                notification.close(id);
            };
            return <><button onClick={open}>通知</button>{contextHolder}</>;
        }`;
    const host = ts.createCompilerHost(options);
    const getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) =>
        name === fileName ? ts.createSourceFile(name, source, languageVersion, true, ts.ScriptKind.TSX) :
            getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile);
    const program = ts.createProgram([fileName], { ...options, noEmit: true, declaration: false }, host);
    const diagnostics = ts.getPreEmitDiagnostics(program);
    expect(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([]);
});
