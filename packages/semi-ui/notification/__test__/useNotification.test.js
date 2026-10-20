import React from 'react';
import { act } from 'react-dom/test-utils';
import useNotification from '../useNotification';

describe('useNotification close', () => {
    it('closes existing notices with the latest API after rerendering', async () => {
        let api;
        function Demo({ version }) {
            const [notice, holder] = useNotification();
            api = notice;
            return <div data-version={version}>{holder}</div>;
        }
        const wrapper = mount(<Demo version={0} />);
        try {
            let first;
            let second;
            await act(async () => {
                first = api.info({ content: 'first notice', duration: 0 });
                second = api.info({ content: 'second notice', duration: 0 });
            });
            wrapper.setProps({ version: 1 });
            expect(wrapper.text()).toContain('first notice');
            expect(wrapper.text()).toContain('second notice');
            await act(async () => { api.close(first); });
            wrapper.update();
            expect(wrapper.text()).not.toContain('first notice');
            expect(wrapper.text()).toContain('second notice');
            await act(async () => { api.close(first); api.close(second); });
            wrapper.update();
            expect(wrapper.text()).toBe('');
        } finally { wrapper.unmount(); }
    });
});
