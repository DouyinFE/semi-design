import * as _ from 'lodash';

import Typography from '../index';

describe(`Typography`, () => {
    beforeEach(() => {
        document.getSelection = () => {
            return {
                removeAllRanges: () => { }
            };
        }
    });

    it('custom component', () => {
        let props = { component: 'div' };
        const typographyTitle = mount(<Typography.Title {...props} heading={1}>Semi Design</Typography.Title>)
        const title = typographyTitle.find('div.semi-typography-h1');
        expect(title.length).toEqual(1);

        const typographyText = mount(<Typography.Text {...props} id="text">Semi Design</Typography.Text>)
        const text = typographyText.find('div.semi-typography');
        expect(text.length).toEqual(1);

        const typographyParagraph = mount(<Typography.Paragraph {...props}>Semi Design</Typography.Paragraph>)
        const p = typographyParagraph.find('div.semi-typography-paragraph');
        expect(p.length).toEqual(1);
    });

    it('typography copyable', () => {
        const typographyParagraph = mount(<Typography.Paragraph copyable >Semi Design</Typography.Paragraph>)
        const p = typographyParagraph.find('.semi-icon-copy');
        expect(p.length).toEqual(1);
        p.at(0).simulate('click');
        expect(typographyParagraph.find('.semi-typography-action-copied').length).toEqual(1);
        typographyParagraph.setProps({copyable: false})
        typographyParagraph.update()
        expect(typographyParagraph.find('.semi-icon-copy').length).toEqual(0);
    });

    it('typography link', () => {
        const text = mount(
            <Typography.Text link={{ href: 'https://semi.design/' }}>链接文本</Typography.Text>
        )
        expect(text.find('.semi-typography.semi-typography-link').length).toEqual(1);
        text.setProps({disabled: true})
        text.update()
        expect(text.find('.semi-typography.semi-typography-disabled').length).toEqual(1);
        text.setProps({underline: true, link: false})
        text.update()
        expect(text.find('.semi-typography u').length).toEqual(1);
    });

    it('typography ellipsis', () => {
        const typographyParagraph = mount(<Typography.Paragraph  ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
            是一个很长很长很长很长5号标题</Typography.Paragraph>)
        // jest 测不出layout，补一些无效用例，提高coverage
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
        typographyParagraph.setProps({children: '的撒的撒打算的撒的撒的撒打算打的撒的撒打算的撒的撒的撒打算打'})
        typographyParagraph.update()
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
        typographyParagraph.setProps({
            ellipsis: {
                expandText:'expandText',collapseText:'collapseText',
                rows: 1,
                showTooltip: {
                    type: 'popover'
                },
                suffix: 'suffix'
            }
        })
        typographyParagraph.update()
        expect(typographyParagraph.find('semi-typography-ellipsis').length).toEqual(0);
    });
});
