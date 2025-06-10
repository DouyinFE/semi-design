module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            ImportDeclaration(path, state) {
                // 只处理 lottie-web 的导入
                if (path.node.source.value === 'lottie-web') {
                    const isESM = state.opts.isESM;

                    // 创建变量声明
                    const varDeclaration = t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier('lottie'),
                            t.identifier('undefined')
                        )
                    ]);

                    if (isESM) {
                        // 创建 IIFE async 函数
                        const iife = t.expressionStatement(
                            t.callExpression(
                                t.arrowFunctionExpression(
                                    [],
                                    t.blockStatement([
                                        t.ifStatement(
                                            t.binaryExpression(
                                                '!==',
                                                t.unaryExpression('typeof', t.identifier('document')),
                                                t.stringLiteral('undefined')
                                            ),
                                            t.blockStatement([
                                                t.expressionStatement(
                                                    t.assignmentExpression(
                                                        '=',
                                                        t.identifier('lottie'),
                                                        t.awaitExpression(
                                                            t.callExpression(
                                                                t.import(),
                                                                [t.stringLiteral('lottie-web')]
                                                            )
                                                        )
                                                    )
                                                )
                                            ])
                                        )
                                    ]),
                                    true  // async
                                ),
                                []
                            )
                        );

                        path.insertBefore(varDeclaration);
                        path.replaceWith(iife);
                    } else {
                        // 原有的 CommonJS 逻辑
                        const ifStatement = t.ifStatement(
                            t.binaryExpression(
                                '!==',
                                t.unaryExpression('typeof', t.identifier('document')),
                                t.stringLiteral('undefined')
                            ),
                            t.blockStatement([
                                t.expressionStatement(
                                    t.assignmentExpression(
                                        '=',
                                        t.identifier('lottie'),
                                        t.callExpression(t.identifier('require'), [
                                            t.stringLiteral('lottie-web')
                                        ])
                                    )
                                ),
                                t.ifStatement(
                                    t.logicalExpression(
                                        '&&',
                                        t.identifier('lottie'),
                                        t.memberExpression(t.identifier('lottie'), t.identifier('__esModule'))
                                    ),
                                    t.expressionStatement(
                                        t.assignmentExpression(
                                            '=',
                                            t.identifier('lottie'),
                                            t.memberExpression(t.identifier('lottie'), t.identifier('default'))
                                        )
                                    )
                                )
                            ])
                        );

                        path.insertBefore(varDeclaration);
                        path.replaceWith(ifStatement);
                    }
                }
            }
        }
    };
};