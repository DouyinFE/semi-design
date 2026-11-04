import Popconfirm from '../index';
import { sleep } from '../../_test_/utils';

describe('Popconfirm visibility notifications', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());
    it.each(['ok', 'cancel'])('notifies once when %s closes the confirmation', async type => {
        const onVisibleChange = sinon.spy();
        wrapper = mount(<Popconfirm motion={false} title="Continue?" onVisibleChange={onVisibleChange}><button id="open">Open</button></Popconfirm>);
        wrapper.find('#open').simulate('click');
        await sleep(100);
        document.querySelector('[data-type="' + type + '"]').click();
        await sleep(100);
        expect(onVisibleChange.args.map(args => args[0])).toEqual([true, false]);
    });
    it('notifies for every close request when a controlled parent keeps it open', () => {
        const onVisibleChange = sinon.spy();
        wrapper = mount(<Popconfirm visible motion={false} title="Continue?" onVisibleChange={onVisibleChange}><button>Open</button></Popconfirm>);
        document.querySelector('[data-type=ok]').click();
        document.querySelector('[data-type=ok]').click();
        expect(onVisibleChange.args.map(args => args[0])).toEqual([false, false]);
    });
});
