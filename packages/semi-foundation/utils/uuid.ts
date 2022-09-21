export default function getUuid(prefix: string) {
    return `${prefix}-${new Date().getTime()}-${Math.random()}`;
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function getUuidv4() {
    try {
        return crypto.randomUUID();
    } catch (err) {
        return getUuid('semi');
    }
}

/**
 * Get a random id with prefix, it not strictly guarantee id uniqueness
 *
 * Note: the return value of getUuid is too long, we need a short one
 *
 * @example
 * getUuidShort({ prefix: 'semi' }) => 'semi-46dinzc'
 * getUuidShort({ prefix: '' }) => '0eer2i0'
 * getUuidShort({ prefix: 'semi', length: 4 }) => 'semi-8jts'
 */
function getUuidShort(options: GetUuidShortOptions = {}) {
    const { prefix = '', length = 7 } = options;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    const total = characters.length;
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const random = Math.floor(Math.random() * total);
        randomId += characters.charAt(random);
    }

    return prefix ? `${prefix}-${randomId}` : randomId;
}

interface GetUuidShortOptions {
    prefix?: string;
    length?: number;
}

export { getUuid, getUuidv4, getUuidShort };
