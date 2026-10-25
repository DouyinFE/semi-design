import React from 'react';
import { renderToString } from 'react-dom/server';
import Collapsible from '../index';

it.each([true, false])('keeps adaptive collapsed preview before measurement with motion=%s', motion => {
    const output = renderToString(<Collapsible isOpen={false} collapseHeight={60} collapseHeightAdaptive motion={motion}>
        <div style={{ height: 120 }}>预览内容</div>
    </Collapsible>);
    const host = document.createElement('div');
    host.innerHTML = output;
    const wrapper = host.firstElementChild as HTMLElement;
    expect(wrapper.style.height).toBe('auto');
    expect(wrapper.style.maxHeight).toBe('60px');
    expect(wrapper.textContent).toBe('预览内容');
});

it('preserves fixed collapsed height without adaptive measurement', () => {
    const output = renderToString(<Collapsible isOpen={false} collapseHeight={60}>预览内容</Collapsible>);
    const host = document.createElement('div');
    host.innerHTML = output;
    expect((host.firstElementChild as HTMLElement).style.height).toBe('60px');
});
