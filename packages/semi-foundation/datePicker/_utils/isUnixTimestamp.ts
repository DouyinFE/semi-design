import isNumber from '../../utils/isNumber';
import { isValidDate } from '../../utils/date';

export default function isUnixTimestamp(ts: any) {
    return isNumber(ts) && ts.toString().length === 10 && isValidDate(new Date(ts * 1000));
}
