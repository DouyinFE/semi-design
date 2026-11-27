import { Divider } from '../../index';

describe('Divider', () => {
    it('Divider-custom className & style', () => {
        const props = {
            className: 'test',
            style: {
                color: 'red',
            },
        };
        const demo = mount(<Divider {...props}/>);
        expect(demo.exists(`.semi-divider.test`)).toEqual(true);
        expect(demo.find(`.semi-divider`)).toHaveStyle('color', 'red');
    });

    it('test title', () => {
        const demo = mount(<Divider>divider title</Divider>);
        expect(demo.getDOMNode().textContent).toEqual('divider title');
    });

    it('test numeric 0 title', () => {
        const demo = mount(<Divider>{0}</Divider>);
        expect(demo.exists('.semi-divider-with-text')).toEqual(true);
        expect(demo.find('.semi-divider_inner-text').text()).toEqual('0');
    });

    it('test empty title', () => {
        const demo = mount(<Divider>{null}</Divider>);
        expect(demo.exists('.semi-divider-with-text')).toEqual(false);
    });

    it('test align', () => {

        const demo = mount(
            <div>
                Semi-Design
                <Divider>divider center title</Divider>
                Semi-Design
                <Divider align="left">divider left title</Divider>
                Semi-Design
                <Divider align="right">divider right title</Divider>
            </div>
        );
        expect(demo.exists(`.semi-divider-with-text-center`)).toBe(true);
        expect(demo.exists(`.semi-divider-with-text-left`)).toBe(true);
        expect(demo.exists(`.semi-divider-with-text-right`)).toBe(true);
    });

    it('test layout', () => {
        const props = {
            layout: 'vertical',
        };
        const demo = mount(
            <div>
                Semi-Design
                <Divider {...props} />
                Semi-Design
                <Divider {...props} />
                Semi-Design
                <Divider {...props} />
            </div>
        );
        expect(demo.exists(`.semi-divider-vertical`)).toBe(true);
        demo.unmount();
    });
    it('test dashed',()=>{
        const props = {
            dashed:true
        };
        const demo = mount(
            <div>
                Semi-Design
                <Divider {...props} />
                Semi-Design
                <Divider {...props} />
                Semi-Design
                <Divider {...props} />
            </div>
        );
        expect(demo.exists('.semi-divider-dashed')).toBe(true);
        demo.unmount();
    })
});
