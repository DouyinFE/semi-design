import { Icon, Dropdown, Tag, HotKeys } from '../../index';
import { string } from 'prop-types';
import { noop, drop } from 'lodash';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import {sleep} from "../../_test_/utils";

function getHK(props) {
    return mount(<HotKeys {...props}></HotKeys>, {
        attachTo: document.getElementById('container'),
    });
}

describe('HotKeys', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        // Avoid `attachTo: document.body` Warning
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
    });

    afterEach(() => {
        const div = document.getElementById('container');
        if (div) {
            document.body.removeChild(div);
        }
    });

    it('HotKeys-custom className & style', () => {
        let props = {
            className: 'test',
            style: {
                color: 'red',
            },
            hotKeys: ['r']
        };
        const hotkeys = getHK(props);
        expect(hotkeys.exists(`.${BASE_CLASS_PREFIX}-hotKeys.test`)).toEqual(true);
        expect(hotkeys.find(`.${BASE_CLASS_PREFIX}-hotKeys`)).toHaveStyle('color', 'red');
    });
});
