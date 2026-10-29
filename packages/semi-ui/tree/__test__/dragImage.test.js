import React from 'react';
import Tree from '../index';

describe('Tree drag images', () => {
    it.each(['hidden', 'custom'])('removes the image when dragging ends (%s)', mode => {
        const props = mode === 'hidden' ? { hideDraggingNode: true } : {
            renderDraggingNode: () => document.createElement('div'),
        };
        const images = [];
        const setDragImage = image => {
            expect(document.body.contains(image)).toBe(true);
            images.push(image);
        };
        const wrapper = mount(<Tree draggable {...props} treeData={[{ label: 'A', key: 'a', value: 'a' }]} />);
        try {
            for (let i = 0; i < 3; i++) {
                const node = wrapper.find('li[role="treeitem"]').first();
                node.simulate('dragStart', { dataTransfer: { setDragImage, setData: () => {} } });
                node.simulate('dragEnd');
                expect(images.every(image => !document.body.contains(image))).toBe(true);
            }
            expect(images.length).toBe(3);
        } finally { wrapper.unmount(); images.forEach(image => image.remove()); }
    });

    it.each(['hidden', 'custom'])('removes an active image on unmount (%s)', mode => {
        const props = mode === 'hidden' ? { hideDraggingNode: true } : {
            renderDraggingNode: () => document.createElement('div'),
        };
        let image;
        const wrapper = mount(<Tree draggable {...props} treeData={[{ label: 'A', key: 'a', value: 'a' }]} />);
        try {
            wrapper.find('li[role="treeitem"]').first().simulate('dragStart', { dataTransfer: {
                setDragImage: element => { image = element; }, setData: () => {},
            } });
            expect(document.body.contains(image)).toBe(true);
            wrapper.unmount();
            expect(document.body.contains(image)).toBe(false);
        } finally {
            if (wrapper.exists()) { wrapper.unmount(); }
            image?.remove();
        }
    });
});
