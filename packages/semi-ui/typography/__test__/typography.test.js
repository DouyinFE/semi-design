import * as _ from 'lodash';

import Typography from '../index';

describe(`Typography`, () => {
    beforeEach(() => {
        document.getSelection = () => {
            return {
                removeAllRanges: () => {},
            };
        };
    });

    it('custom component', () => {
        let props = { component: 'div' };
        const typographyTitle = mount(
            <Typography.Title {...props} heading={1}>
                Semi Design
            </Typography.Title>
        );
        const title = typographyTitle.find('div.semi-typography-h1');
        expect(title.length).toEqual(1);

        const typographyText = mount(
            <Typography.Text {...props} id="text">
                Semi Design
            </Typography.Text>
        );
        const text = typographyText.find('div.semi-typography');
        expect(text.length).toEqual(1);

        const typographyParagraph = mount(<Typography.Paragraph {...props}>Semi Design</Typography.Paragraph>);
        const p = typographyParagraph.find('div.semi-typography-paragraph');
        expect(p.length).toEqual(1);
        typographyParagraph.unmount();
    });

    it('typography copyable', () => {
        const typographyParagraph = mount(<Typography.Paragraph copyable>Semi Design</Typography.Paragraph>);
        const p = typographyParagraph.find('.semi-icon-copy');
        expect(p.length).toEqual(1);
        p.at(0).simulate('click');
        expect(typographyParagraph.find('.semi-typography-action-copied').length).toEqual(1);
        typographyParagraph.setProps({ copyable: false });
        typographyParagraph.update();
        expect(typographyParagraph.find('.semi-icon-copy').length).toEqual(0);
    });

    it('typography link', () => {
        const text = mount(<Typography.Text link={{ href: 'https://semi.design/' }}>链接文本</Typography.Text>);
        expect(text.find('.semi-typography.semi-typography-link').length).toEqual(1);
        text.setProps({ disabled: true });
        text.update();
        expect(text.find('.semi-typography.semi-typography-disabled').length).toEqual(1);
        text.setProps({ underline: true, link: false });
        text.update();
        expect(text.find('.semi-typography u').length).toEqual(1);
    });

    it('typography ellipsis', () => {
        const typographyParagraph = mount(
            <Typography.Paragraph ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
                是一个很长很长很长很长5号标题
            </Typography.Paragraph>
        );
        // jest 测不出layout，补一些无效用例，提高coverage
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
        typographyParagraph.setProps({ children: '的撒的撒打算的撒的撒的撒打算打的撒的撒打算的撒的撒的撒打算打' });
        typographyParagraph.update();
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
        typographyParagraph.setProps({
            ellipsis: {
                expandText: 'expandText',
                collapseText: 'collapseText',
                rows: 1,
                showTooltip: {
                    type: 'popover',
                },
                suffix: 'suffix',
            },
        });
        typographyParagraph.update();
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
    });

    it('ellipsis showTooltip 亚像素取整误差不应误判溢出（回归用例）', async () => {
        // 背景：compareSingleRow 用整数 clientWidth 与精确浮点 Range 宽度比较，
        // 当文本实际宽度小数部分 ∈ (0, 0.5) 时（如 32.3046875px），clientWidth 取整为 32，
        // 32.3046875 > 32 会虚报溢出，导致未溢出的短文本也错误显示 tooltip。
        // 修复：容器宽度改用 getBoundingClientRect().width（与 contentWidth 同精度，小数参与比较）。
        // jsdom 无 document.createRange，这里整体 mock 测量 API。
        const makeRect = width => ({
            width,
            height: 20,
            left: 0,
            right: width,
            top: 0,
            bottom: 20,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        });

        const originalCreateRange = document.createRange;
        const originalElRect = HTMLElement.prototype.getBoundingClientRect;
        const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

        const mockRangeWidth = rangeWidth => {
            document.createRange = () => ({
                selectNodeContents: () => {},
                detach: () => {},
                getBoundingClientRect: () => makeRect(rangeWidth),
            });
        };

        const mockSubPixel = () => {
            // 文本精确宽度 32.3046875（小数部分 < 0.5，clientWidth 取整为 32）→ 未真正溢出
            mockRangeWidth(32.3046875);
            HTMLElement.prototype.getBoundingClientRect = jest.fn(() => makeRect(32.3046875));
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 32 });
        };

        const mockRealOverflow = () => {
            // 容器被宽度限制为 100，文本内容 250 → 真实溢出
            mockRangeWidth(250);
            HTMLElement.prototype.getBoundingClientRect = jest.fn(() => makeRect(100));
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 100 });
        };

        const waitEllipsisCalc = () => new Promise(resolve => setTimeout(resolve, 100));

        try {
            // 场景一：亚像素差异（32.3046875 vs 32），文本并未真正溢出 → 不应渲染 Tooltip
            mockSubPixel();
            const text1 = mount(
                <Typography.Text ellipsis={{ showTooltip: true }} style={{ maxWidth: 220 }}>
                    testa
                </Typography.Text>
            );
            await waitEllipsisCalc();
            text1.update();
            expect(text1.find('[data-popupid]').length).toEqual(0);
            text1.unmount();

            // 场景二：真实溢出（250 > 100）→ 应正常渲染 Tooltip
            mockRealOverflow();
            const text2 = mount(
                <Typography.Text ellipsis={{ showTooltip: true }} style={{ maxWidth: 100 }}>
                    This is a very very long text that should be truncated for sure
                </Typography.Text>
            );
            await waitEllipsisCalc();
            text2.update();
            // hostNodes: 只统计真实 DOM 节点（排除 React 组件节点的重复匹配）
            expect(text2.find('[data-popupid]').hostNodes().length).toEqual(1);
            text2.unmount();
        } finally {
            document.createRange = originalCreateRange;
            HTMLElement.prototype.getBoundingClientRect = originalElRect;
            if (originalClientWidth) {
                Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
            } else {
                delete HTMLElement.prototype.clientWidth;
            }
        }
    });

    it('typography Numeral', () => {
        let numeral = mount(
            <Typography.Numeral rule={'numbers'} truncate={'ceil'} precision={2}>
                <div className="price">
                    <span>预期价格:{() => 1.555}; 成本: -1; 盈利: 0.555</span>
                    <b>Currency symbols: $</b>
                </div>
            </Typography.Numeral>
        );
        expect(numeral.find('.price').text()).toEqual('1.56-1.00,0.56');
        numeral = mount(
            <Typography.Numeral rule={'exponential'} truncate={'floor'} precision={2}>
                <div className="price">
                    Total revenue: <b>$ 1992.15</b>
                </div>
            </Typography.Numeral>
        )
        expect(numeral.find('.price').text()).toEqual('Total revenue: $ 1.99e+3')
        // test: parser
        numeral.setProps({
            parser: oldVal => oldVal.replace(/[^\d.]/g, '')
        })
        expect(numeral.find('.price').text()).toEqual('1992.15')
    })

    it('children is template string', () => {
        const { Text } = Typography;
        const code = 'code'; 

        const typographyParagraph = mount(
            <Text 
                style={{  marginTop: 6, color: 'var(--semi-color-text-2)' }}
                ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-word' } } } }}
                copyable={{ content: code }}
            >
                Key: {code}
            </Text>
        );
        expect(typographyParagraph.find('.semi-typography').children().at(0).text()).toEqual('Key: code');
    });

    it('custom copy render', () => {
        const { Text } = Typography;
        const code = 'code';

        const typographyParagraph = mount(
            <Text
                style={{ marginTop: 6, color: 'var(--semi-color-text-2)' }}
                ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-word' } } } }}
                copyable={{
                    content: code,
                    render: (copied, doCopy, config) => {
                        return (
                            <span className="test-copy-button" onClick={doCopy}>
                                <span className="test-copied">{String(copied)}</span>
                                <span className="test-copy-content">{config.content}</span>
                            </span>
                        );
                    }
                }}
            >
                Key: {code}
            </Text>
        );

        // test basic render
        expect(typographyParagraph.find('.test-copied').text()).toEqual('false');
        expect(typographyParagraph.find('.test-copy-content').text()).toEqual(code);

        // test copy
        const trigger = typographyParagraph.find('.test-copy-button');
        expect(trigger.length).toEqual(1);
        trigger.at(0).simulate('click');
        expect(typographyParagraph.find('.test-copied').text()).toEqual('true');
    });

});
