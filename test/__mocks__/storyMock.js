import React from 'react';
import { mount, render, shallow } from 'enzyme';

// some component story need special process
// function componentTestAdapter(describeName, module) {
//     switch (describeName) {
//         case 'Banner':
//             let firstChild = document.createElement('div');
//             document.body.appendChild(firstChild);
//             break;
//         default:
//             break;
//     }
// }

export const storiesOf = function storiesOf(describeName, module) {
    let api = {};
    // describe('stories-' + describeName);
    api.add = function (name, funcDemo) {
        it(name, () => {
            const div = document.createElement('div');
            div.setAttribute('id', 'container');
            document.body.appendChild(div);

            // story snapshot test need stable random value
            window.crypto.getRandomValues = arr => arr.length;

            // Ingore Component Story
            const ingoreComponent = ['OverflowList', 'Table', 'Form', 'Select'];
            // OverflowList use IntersectionObserver API, can't easy mock in jest environment, just skip it.
            // TODO - Find out why test story of  Table/Select/Form will cause a stack overflow
            let wrapper = null;
            if (!ingoreComponent.includes(describeName)) {
                // funcDemo may be a function component (using hooks) or a plain render
                // function returning a React element. Wrap it in React.createElement so
                // hooks are dispatched through React's normal render cycle.
                // can't attactTo document.body, some story will render to null, so weird.
                wrapper = mount(React.createElement(funcDemo), { attachTo: document.getElementById('container') });
            }

            // componentTestAdapter(describeName, module);
            // const wrapper = mount(funcDemo(), { attachTo: document.body });

            // Some component trees render so deeply (markdown + many child
            // components) that enzyme-to-json's fiber serializer blows up with
            // "Invalid string length" (the produced JSON exceeds V8's max
            // string length). For those components, snapshot the rendered HTML
            // string instead, which is still meaningful and bounded.
            const htmlSnapshotComponent = ['Chat'];
            if (wrapper && htmlSnapshotComponent.includes(describeName) && typeof wrapper.html === 'function') {
                expect(wrapper.html()).toMatchSnapshot();
            } else {
                expect(wrapper).toMatchSnapshot();
            }

            document.body.removeChild(div);
            document.body.innerHTML = '';
        });
        return api;
    };

    api.addWithInfo = function (name, func) {
        func();
        return api;
    };
    api.addDecorator = function () {};
    return api;
};
