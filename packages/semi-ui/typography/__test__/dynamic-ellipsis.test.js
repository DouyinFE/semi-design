import Typography from '../index';
import Base from '../base';

describe('Typography dynamic ellipsis', () => {
    it('measures and enables resize observation when ellipsis is enabled after mount', async () => {
        const wrapper = mount(<Typography.Text>Same content</Typography.Text>);
        const base = wrapper.find(Base).instance();
        const measure = rs.spyOn(base, 'onResize').mockResolvedValue();
        wrapper.setProps({ ellipsis: { expandable: true } });
        expect(measure).toHaveBeenCalledTimes(1);
        await new Promise(resolve => setTimeout(resolve, 20));
        expect(base.observerTakingEffect).toBe(true);
        wrapper.unmount();
    });
    it('keeps observation enabled when children and ellipsis change together', async () => {
        const wrapper = mount(<Typography.Text>Before</Typography.Text>);
        const base = wrapper.find(Base).instance();
        const measure = rs.spyOn(base, 'onResize').mockResolvedValue();
        wrapper.setProps({ children: 'After', ellipsis: { expandable: true } });
        expect(measure).toHaveBeenCalledTimes(1);
        await new Promise(resolve => setTimeout(resolve, 20));
        expect(base.observerTakingEffect).toBe(true);
        wrapper.unmount();
    });
});
