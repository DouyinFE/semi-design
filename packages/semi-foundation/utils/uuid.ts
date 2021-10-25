export default function getUuid(prefix: string) {
    return `${prefix}-${new Date().getTime()}-${Math.random()}`;
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function getUuidv4() {
    try {
        return String(1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
        );
    } catch (err) {
        return getUuid('semi');
    }
}

export { getUuid, getUuidv4 };
