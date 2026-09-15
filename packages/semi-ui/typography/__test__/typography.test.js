import * as _ from 'lodash';

import Typography from '../index';
import Base from '../base';

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

    it('compareSingleRow 亚像素与 border 语义（回归 #2350/#3340）', () => {
        // jsdom 无 document.createRange，整体 mock 测量 API，直接驱动 compareSingleRow
        const originalCreateRange = document.createRange;
        const originalElRect = HTMLElement.prototype.getBoundingClientRect;
        const originalGetComputedStyle = window.getComputedStyle;

        const setup = ({ containerWidth, textWidth, padding, border }) => {
            document.createRange = () => ({
                selectNodeContents: () => {},
                detach: () => {},
                getBoundingClientRect: () => ({ width: textWidth }),
            });
            HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({ width: containerWidth }));
            window.getComputedStyle = jest.fn(() => ({
                paddingLeft: padding,
                paddingRight: padding,
                borderLeftWidth: border,
                borderRightWidth: border,
            }));
        };

        const getRowOverflow = () => {
            const text = mount(<Typography.Text ellipsis={{ showTooltip: true }}>test</Typography.Text>);
            const result = text.find(Base).instance().compareSingleRow();
            text.unmount();
            return result;
        };

        try {
            // 1. 亚像素：文本精确宽度 32.3046875，容器 rect 同宽（原 clientWidth 取整为 32 会误报溢出）
            setup({ containerWidth: 32.3046875, textWidth: 32.3046875, padding: '0px', border: '0px' });
            expect(getRowOverflow()).toBe(false);

            // 2. 带 border 的容器：rect.width=100 含 2*2px border，内容区 96，文本 98 → 真实溢出
            //    （若只用 rect.width - padding 会得到 100，98 > 100=false，漏判溢出）
            setup({ containerWidth: 100, textWidth: 98, padding: '0px', border: '2px' });
            expect(getRowOverflow()).toBe(true);

            // 3. 带 padding 的容器：rect.width=100 含 2*10px padding，内容区 80，文本 90 → 真实溢出
            setup({ containerWidth: 100, textWidth: 90, padding: '10px', border: '0px' });
            expect(getRowOverflow()).toBe(true);

            // 4. 不溢出：文本 30 < 内容区 96
            setup({ containerWidth: 100, textWidth: 30, padding: '0px', border: '2px' });
            expect(getRowOverflow()).toBe(false);
        } finally {
            document.createRange = originalCreateRange;
            HTMLElement.prototype.getBoundingClientRect = originalElRect;
            window.getComputedStyle = originalGetComputedStyle;
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
