import { get } from 'lodash-es';
import { ENTER_KEY_CODE } from './keyCode';

function isEnterPress<T extends { key: string }>(e: T) {
    return get(e, 'key') === ENTER_KEY_CODE ? true : false;
}

export default isEnterPress;