import React from 'react';
import Anchor from '..';

const Link = Anchor.Link;
const branch = () => <Link href="#parent" title="Parent"><Link href="#child" title="Child" /></Link>;
const title = (wrapper, href) => wrapper.find(Link).filterWhere(link => link.prop('href') === href).find('.semi-anchor-link-title').first();

describe('Anchor descendant mapping', () => {
    [
        ['single child', () => branch()],
        ['root fragment', () => <>{branch()}</>],
        ['nested fragment', () => <Link href="#parent" title="Parent"><><Link href="#child" title="Child" /></></Link>],
        ['nested array', () => <Link href="#parent" title="Parent">{[[<Link key="child" href="#child" title="Child" />]]}</Link>],
    ].forEach(([name, children]) => {
        it(`keeps the branch open when selecting a descendant through ${name}`, () => {
            const wrapper = mount(<Anchor autoCollapse scrollMotion={false}>{children()}</Anchor>);
            title(wrapper, '#parent').simulate('click');
            expect(title(wrapper, '#child').exists()).toBe(true);
            title(wrapper, '#child').simulate('click');
            expect(title(wrapper, '#child').exists()).toBe(true);
            expect(title(wrapper, '#child').hasClass('semi-anchor-link-title-active')).toBe(true);
            wrapper.unmount();
        });
    });

    it('keeps sibling branches separate', () => {
        const wrapper = mount(<Anchor autoCollapse scrollMotion={false}>
            {branch()}<Link href="#other" title="Other"><Link href="#leaf" title="Leaf" /></Link>
        </Anchor>);
        title(wrapper, '#parent').simulate('click');
        title(wrapper, '#child').simulate('click');
        expect(title(wrapper, '#child').exists()).toBe(true);
        expect(title(wrapper, '#leaf').exists()).toBe(false);
        title(wrapper, '#other').simulate('click');
        expect(title(wrapper, '#child').exists()).toBe(false);
        expect(title(wrapper, '#leaf').exists()).toBe(true);
        wrapper.unmount();
    });
});
