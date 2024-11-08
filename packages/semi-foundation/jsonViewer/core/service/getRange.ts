/** reference from https://github.com/microsoft/vscode-json-languageservice*/

// @ts-nocheck
import { JSONModel } from '../model/jsonModel';
import { createScanner, SyntaxKind, ScanError } from 'jsonc-parser';
export function getFoldingRanges(jsonModel: JSONModel) {
    const ranges: FoldingRange[] = [];
    const nestingLevels: number[] = [];
    const stack: FoldingRange[] = [];
    let prevStart = -1;
    const scanner = createScanner(jsonModel.getValue(), false);
    let token = scanner.scan();

    function addRange(range: FoldingRange) {
        ranges.push(range);
        nestingLevels.push(stack.length);
    }

    while (token !== SyntaxKind.EOF) {
        switch (token) {
            case SyntaxKind.OpenBraceToken:
            case SyntaxKind.OpenBracketToken: {
                const startLine = jsonModel.positionAt(scanner.getPosition()).lineNumber;
                const range: FoldingRange = {
                    startLine,
                    endLine: startLine,
                    kind: token === SyntaxKind.OpenBraceToken ? 'object' : 'array',
                };
                stack.push(range);
                break;
            }
            case SyntaxKind.CloseBraceToken:
            case SyntaxKind.CloseBracketToken: {
                const kind = token === SyntaxKind.CloseBraceToken ? 'object' : 'array';
                if (stack.length > 0 && stack[stack.length - 1].kind === kind) {
                    const range = stack.pop();
                    const line = jsonModel.positionAt(scanner.getTokenOffset()).lineNumber;
                    if (range && line > range.startLine + 1 && prevStart !== range.startLine) {
                        range.endLine = line - 1;
                        addRange(range);
                        prevStart = range.startLine;
                    }
                }
                break;
            }
        }
        token = scanner.scan();
    }
    return ranges;
}
