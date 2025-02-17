module.exports = function (babel) {
    const { types: t } = babel;
    return {
        visitor: {
            ImportDeclaration(path) {
                // 只处理 lottie-web 的导入
                if (path.node.source.value === 'lottie-web') {
                    // 创建变量声明
                    const varDeclaration = t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier('_lottieWeb'),
                            t.identifier('undefined')
                        )
                    ]);

                    // 创建条件语句
                    const ifStatement = t.ifStatement(
                        t.binaryExpression(
                            '!==',
                            t.unaryExpression('typeof', t.identifier('document')),
                            t.stringLiteral('undefined')
                        ),
                        t.blockStatement([
                            // _lottieWeb = require("lottie-web")
                            t.expressionStatement(
                                t.assignmentExpression(
                                    '=',
                                    t.identifier('_lottieWeb'),
                                    t.callExpression(t.identifier('require'), [
                                        t.stringLiteral('lottie-web')
                                    ])
                                )
                            ),
                            // if (_lottieWeb && _lottieWeb.__esModule) _lottieWeb = _lottieWeb.default
                            t.ifStatement(
                                t.logicalExpression(
                                    '&&',
                                    t.identifier('_lottieWeb'),
                                    t.memberExpression(t.identifier('_lottieWeb'), t.identifier('__esModule'))
                                ),
                                t.expressionStatement(
                                    t.assignmentExpression(
                                        '=',
                                        t.identifier('_lottieWeb'),
                                        t.memberExpression(t.identifier('_lottieWeb'), t.identifier('default'))
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
    };
};